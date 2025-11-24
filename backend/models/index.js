// backend/models/index.js
import { Product } from "./Product.js";
import { InventoryLog } from "./InventoryLog.js";

Product.hasMany(InventoryLog, {
    foreignKey: "productId",
    onDelete: "CASCADE"
});

InventoryLog.belongsTo(Product, { foreignKey: "productId" });

export { Product, InventoryLog };
