import fs from "fs/promises";
import path from "path";

const dataDir = path.resolve("data");
await fs.mkdir(dataDir, { recursive: true });

export async function readJSON(filename, defaultValue = []) {
    const full = path.join(dataDir, filename);
    try {
        const raw = await fs.readFile(full, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === "ENOENT") {
            await fs.writeFile(full, JSON.stringify(defaultValue, null, 2));
            return defaultValue;
        }
        throw err;
    }
}

export async function writeJSON(filename, data) {
    const full = path.join(dataDir, filename);
    await fs.writeFile(full, JSON.stringify(data, null, 2));
}