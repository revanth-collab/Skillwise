// backend/models/Product.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Product = sequelize.define(
    "Product",
    {
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        brand: { type: DataTypes.STRING, allowNull: false },
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING }
    },
    {
        tableName: "products",
        timestamps: true
    }
);
