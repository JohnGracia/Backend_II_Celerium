import { Router } from "express";
import passport from "passport";
import { authorizeRole } from "../middlewares/authorization.js";
import Product from "../models/product.model.js";

const router = Router();

// 🟢 Obtener todos los productos (público)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error("Error getting products:", err);
        res.status(500).json({ message: "Error retrieving products" });
    }
});

// 🔵 Crear producto (solo admin)
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRole("admin"),
    async (req, res) => {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            console.error("Error creating product:", err);
            res.status(500).json({ message: "Error creating product" });
        }
    }
);

// 🟣 Actualizar producto (solo admin)
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    authorizeRole("admin"),
    async (req, res) => {
        try {
            const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updated)
                return res.status(404).json({ message: "Product not found" });
            res.json(updated);
        } catch (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ message: "Error updating product" });
        }
    }
);

// 🔴 Eliminar producto (solo admin)
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    authorizeRole("admin"),
    async (req, res) => {
        try {
            const deleted = await Product.findByIdAndDelete(req.params.id);
            if (!deleted)
                return res.status(404).json({ message: "Product not found" });
            res.json({ message: "Product deleted" });
        } catch (err) {
            console.error("Error deleting product:", err);
            res.status(500).json({ message: "Error deleting product" });
        }
    }
);

export default router;