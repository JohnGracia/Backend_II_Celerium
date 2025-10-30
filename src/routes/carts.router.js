import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const router = Router();

// 🟢 Crear carrito nuevo
router.post("/", async (req, res) => {
    try {
        const cart = await Cart.create({ products: [] });
        res.status(201).json(cart);
    } catch (err) {
        console.error("Error creating cart:", err);
        res.status(500).json({ message: "Error creating cart" });
    }
});

// 🔵 Obtener carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json(cart);
    } catch (err) {
        console.error("Error getting cart:", err);
        res.status(500).json({ message: "Error retrieving cart" });
    }
});

// 🟣 Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart || !product)
            return res.status(404).json({ message: "Cart or product not found" });

        const existing = cart.products.find((p) => p.product.equals(pid));
        if (existing) existing.quantity += 1;
        else cart.products.push({ product: pid, quantity: 1 });

        await cart.save();
        await cart.populate("products.product");

        res.json(cart);
    } catch (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).json({ message: "Error adding product to cart" });
    }
});

// 🔴 Eliminar producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter((p) => !p.product.equals(pid));
        await cart.save();
        await cart.populate("products.product");

        res.json(cart);
    } catch (err) {
        console.error("Error removing product from cart:", err);
        res.status(500).json({ message: "Error removing product from cart" });
    }
});

export default router;