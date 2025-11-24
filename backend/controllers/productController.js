// backend/controllers/productController.js
import { Product, InventoryLog } from "../models/index.js";
import { normalizeStatus } from "../utils/normalizeStatus.js";
import { parse } from "csv-parse";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            sortBy = "id",
            sortOrder = "ASC",
            category,
            status,
            search
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const where = {};

        if (category) where.category = category;
        if (status) where.status = status;

        if (search) {
            where.name = { [Op.like]: `%${search.toLowerCase()}%` };
        }

        const products = await Product.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: [[sortBy, sortOrder]]
        });

        res.json({
            data: products.rows,
            pagination: {
                page,
                limit,
                total: products.count,
                totalPages: Math.ceil(products.count / limit)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// -------------------------
// GET /search
// -------------------------
export const searchProducts = async (req, res) => {
    try {
        const name = req.query.name?.toLowerCase() || "";
        const products = await Product.findAll({
            where: { name: { [Op.like]: `%${name}%` } }
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};

// -------------------------
// Add Product
// -------------------------
export const addProduct = async (req, res) => {
    try {
        let { name, unit, category, brand, stock, image } = req.body;

        stock = parseInt(stock);

        const exists = await Product.findOne({
            where: { name: name.toLowerCase() }
        });

        if (exists)
            return res.status(400).json({ error: "Product name must be unique" });

        const product = await Product.create({
            name,
            unit,
            category,
            brand,
            stock,
            status: normalizeStatus(stock),
            image
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: "Product creation failed" });
    }
};

// -------------------------
// Update product & log
// -------------------------
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, unit, category, brand, stock, image, changedBy } = req.body;

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const oldStock = product.stock;
        const newStock = parseInt(stock);

        await product.update({
            name,
            unit,
            category,
            brand,
            stock: newStock,
            status: normalizeStatus(newStock),
            image
        });

        if (oldStock !== newStock) {
            await InventoryLog.create({
                productId: id,
                oldStock,
                newStock,
                changedBy
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
};

// -------------------------
// Delete Product
// -------------------------
export const deleteProduct = async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
};

// -------------------------
// Get product history
// -------------------------
export const getHistory = async (req, res) => {
    try {
        const logs = await InventoryLog.findAll({
            where: { productId: req.params.id },
            order: [["createdAt", "DESC"]]
        });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
};

// -------------------------
// Import CSV
// -------------------------
export const importCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "CSV file required" });

    const filePath = req.file.path;
    let added = 0,
        skipped = 0;
    const duplicates = [];

    const parser = fs
        .createReadStream(filePath)
        .pipe(parse({ columns: true, trim: true }));

    try {
        for await (const r of parser) {
            const existing = await Product.findOne({
                where: { name: r.name.toLowerCase() }
            });

            if (existing) {
                skipped++;
                duplicates.push(existing);
                continue;
            }

            await Product.create({
                name: r.name,
                unit: r.unit,
                category: r.category,
                brand: r.brand,
                stock: parseInt(r.stock),
                status: normalizeStatus(r.stock),
                image: r.image || ""
            });

            added++;
        }

        fs.unlinkSync(filePath);

        res.json({ added, skipped, duplicates });
    } catch (err) {
        fs.unlinkSync(filePath);
        res.status(500).json({ error: "CSV import failed" });
    }
};

// -------------------------
// Export CSV
// -------------------------
export const exportCSV = async (req, res) => {
    try {
        const products = await Product.findAll();

        let csv = "id,name,unit,category,brand,stock,status,image\n";
        products.forEach((p) => {
            csv += `${p.id},"${p.name}","${p.unit}","${p.category}","${p.brand}",${p.stock},"${p.status}","${p.image}"\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: "CSV export failed" });
    }
};
