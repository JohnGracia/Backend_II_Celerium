import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.model.js';
import { generateToken } from '../utils/jwt.js';

// Registro (create user)
export async function register(req, res) {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'first_name, last_name, email y password son requeridos' });
        }

        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        // Encriptar contraseña con bcrypt.hashSync (requisito)
        const hashed = bcrypt.hashSync(password, 10);

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            age,
            password: hashed,
            cart,
            role: role || 'user'
        });

        // devolver sin password
        const userSafe = newUser.toObject();
        delete userSafe.password;

        return res.status(201).json({ message: 'User created', user: userSafe });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Login -> genera JWT
export async function login(req, res, next) {
    // Esta ruta usa passport local; si llega aquí, el usuario está en req.user
    try {
        const user = req.user;
        // payload mínimo
        const payload = { id: user._id, email: user.email, role: user.role };
        const token = generateToken(payload);

        return res.json({ message: 'Login success', token, user: { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role } });
    } catch (err) {
        next(err);
    }
}

// Ruta current -> devuelve datos desde JWT (passport jwt/current)
export async function current(req, res) {
    // passport 'current' deja el usuario en req.user (sin password, tal como definimos la estrategia)
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    return res.json({ user: req.user });
}

// (Opcional) CRUD básico de usuarios (read, update, delete)
export async function getUsers(req, res) {
    try {
        const users = await UserModel.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ error: 'server error' }); }
}

export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ error: 'server error' }); }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const update = { ...req.body };
        if (update.password) {
            // si actualizan contraseña, re-hashearla
            update.password = bcrypt.hashSync(update.password, 10);
        }
        const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ error: 'server error' }); }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) { res.status(500).json({ error: 'server error' }); }
}
