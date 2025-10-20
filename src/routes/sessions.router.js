import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const router = Router();

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login con JWT
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { user: { id: user._id, email: user.email, role: user.role } },
            process.env.JWT_SECRET || "coderSecret",
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Validación del usuario actual
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        res.status(200).json({ user: req.user });
    }
);

export default router;
