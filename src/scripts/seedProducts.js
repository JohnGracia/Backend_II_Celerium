import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import fs from "fs/promises";
import path from "path";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/celerium";

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Mongo conectado");
        const file = path.resolve("data", "products.json");
        const raw = await fs.readFile(file, "utf8");
        const products = JSON.parse(raw);

        // opcional: limpiar colección
        await Product.deleteMany({});
        const inserted = await Product.insertMany(products);
        console.log("Seed completado. Insertados:", inserted.length);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();