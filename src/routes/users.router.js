import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";
import { authorizeRole } from "../middlewares/authorization.js";

const router = Router();

// Middleware de autenticación con JWT (Passport)
const authenticate = passport.authenticate("jwt", { session: false });

// 🔹 Obtener todos los usuarios (solo admin)
router.get("/", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const users = await User.find();
        res.json({ status: "success", users });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving users", error: err.message });
    }
});

// 🔹 Obtener un usuario por ID (solo admin)
router.get("/:uid", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ status: "success", user });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user", error: err.message });
    }
});

// 🔹 Crear un usuario (solo admin puede crear otros usuarios)
router.post("/", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const newUser = await User.create({ first_name, last_name, email, age, password, role });
        res.status(201).json({ status: "success", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// 🔹 Actualizar usuario (solo admin)
router.put("/:uid", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json({ status: "success", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
});

// 🔹 Eliminar usuario (solo admin)
router.delete("/:uid", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.uid);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ status: "success", message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

export default router;
