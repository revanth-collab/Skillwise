import React, { useEffect, useState } from "react";
import {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getHistory,
    importCSV,
    exportCSV,
} from "../api/productApi";

import ProductTable from "./ProductTable";
import Pagination from "./Pagination";
import AddProductModal from "./AddProductModal";
import ProductHistorySidebar from "./ProductHistorySidebar";

export default function ProductInventoryPage() {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("ASC");

    const [showAdd, setShowAdd] = useState(false);

    const [historyProduct, setHistoryProduct] = useState(null);
    const [historyList, setHistoryList] = useState([]);

    const load = async () => {
        const res = await getProducts({
            page,
            limit,
            search,
            category,
            sortBy,
            sortOrder,
        });

        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
    };

    useEffect(() => {
        load();
    }, [page, search, category, sortBy, sortOrder]);

    const onSort = (field) => {
        const order = sortOrder === "ASC" ? "DESC" : "ASC";
        setSortOrder(order);
        setSortBy(field);
    };

    const onAddProduct = async (data) => {
        await addProduct(data);
        setShowAdd(false);
        load();
    };

    const onDeleteRow = async (id) => {
        if (!confirm("Delete product?")) return;
        await deleteProduct(id);
        load();
    };

    const onUpdateRow = async (id, data) => {
        await updateProduct(id, data);
        load();
    };

    const openHistory = async (product) => {
        setHistoryProduct(product);
        const res = await getHistory(product.id);
        setHistoryList(res.data);
    };

    const categories = [...new Set(products.map((p) => p.category))];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-5">Inventory Management</h1>

            {/* TOP CONTROLS */}
            <div className="flex gap-3 mb-5">
                <input
                    className="border px-3 py-2 rounded w-64"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border px-3 py-2 rounded"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option value={c} key={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => setShowAdd(true)}
                >
                    + Add
                </button>

                <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer">
                    Import CSV
                    <input
                        type="file"
                        hidden
                        accept=".csv"
                        onChange={(e) => importCSV(e.target.files[0])}
                    />
                </label>

                <button
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={async () => {
                        const res = await exportCSV();
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(new Blob([res.data]));
                        a.download = "products.csv";
                        a.click();
                    }}
                >
                    Export CSV
                </button>
            </div>

            {/* TABLE */}
            <ProductTable
                products={products}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
                onRowClick={openHistory}
                onDelete={onDeleteRow}
                onSaveRow={onUpdateRow}
            />

            {/* PAGINATION */}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            {/* ADD MODAL */}
            <AddProductModal
                open={showAdd}
                onClose={() => setShowAdd(false)}
                onSubmit={onAddProduct}
            />

            {/* HISTORY SIDEBAR */}
            <ProductHistorySidebar
                product={historyProduct}
                history={historyList}
                onClose={() => setHistoryProduct(null)}
            />
        </div>
    );
}
