import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "c3l3r1umSuperSecretKey2025";

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User created", user: newUser });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login local (passport-local)
router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    async (req, res) => {
        try {
            const user = req.user;
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || "2h",
            });
            res.json({ status: "success", token });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ message: "Error logging in" });
        }
    }
);

// Ruta protegida /current
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            status: "success",
            user: req.user,
        });
    }
);

export default router;