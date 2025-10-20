import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import initializePassport from './config/passport.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// inicializar passport (configura strategies)
initializePassport();
app.use(passport.initialize());

// montar rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// --- Conexión a MongoDB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/celerium';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo connection error', err));

// puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
