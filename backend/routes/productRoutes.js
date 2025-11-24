// backend/routes/productRoutes.js
import { Router } from "express";
import multer from "multer";
import { getProducts, searchProducts, addProduct, updateProduct, deleteProduct, getHistory, importCSV, exportCSV } from "../controllers/productController.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getProducts);
router.get("/search", searchProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id/history", getHistory);

router.post("/import", upload.single("file"), importCSV);
router.get("/export", exportCSV);

export default router;
