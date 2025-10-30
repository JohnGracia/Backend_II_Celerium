import { Router } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const router = Router();

// 🟢 Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error retrieving users" });
    }
});

// 🔵 Obtener usuario por ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Error retrieving user" });
    }
});

// 🟣 Actualizar usuario
router.put("/:id", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        if (password) rest.password = bcrypt.hashSync(password, 10);

        const updated = await User.findByIdAndUpdate(req.params.id, rest, {
            new: true,
        }).select("-password");

        if (!updated) return res.status(404).json({ message: "User not found" });
        res.json(updated);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Error updating user" });
    }
});

// 🔴 Eliminar usuario
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user" });
    }
});

export default router;