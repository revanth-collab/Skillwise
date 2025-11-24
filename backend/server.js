// backend/server.js
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { connectDB } from "./config/db.js";
import { sequelize } from "./config/db.js";
import "./models/index.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

// Connect + Sync DB
await connectDB();
await sequelize.sync({ alter: true });

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
