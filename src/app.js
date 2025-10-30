import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import initializePassport from "./config/passport.js";

// Routers
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";

// Configuración inicial
dotenv.config();
const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Conexión a MongoDB (solo si STORAGE = MONGO)
if (process.env.STORAGE === "MONGO") {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/celerium";
    mongoose
        .connect(MONGO_URI)
        .then(() => console.log("✅ Mongo connected"))
        .catch((err) => console.error("❌ Mongo connection error:", err));
} else {
    console.log("📦 Modo FS activado: se usará persistencia en archivos JSON");
}

// Rutas API
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

// Ruta raíz (simple check)
app.get("/", (req, res) => {
    res.send("🚀 Bienvenido a Celerium Patinaje API");
});

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

// Servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

export default app;