// backend/models/InventoryLog.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const InventoryLog = sequelize.define(
    "InventoryLog",
    {
        oldStock: { type: DataTypes.INTEGER, allowNull: false },
        newStock: { type: DataTypes.INTEGER, allowNull: false },
        changedBy: { type: DataTypes.STRING, allowNull: false }
    },
    {
        tableName: "inventory_logs",
        timestamps: true
    }
);
