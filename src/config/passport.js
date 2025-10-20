import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js'; // ✅ import por defecto

const JWT_SECRET = process.env.JWT_SECRET || 'coderSecret';

export default function initializePassport() {
    // 🔹 Estrategia LOCAL (login con email y password)
    passport.use('local', new LocalStrategy(
        { usernameField: 'email', passwordField: 'password', session: false },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase() });
                if (!user) return done(null, false, { message: 'User not found' });

                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid) return done(null, false, { message: 'Invalid credentials' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // 🔹 Estrategia JWT (autenticación con token)
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    };

    passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            // payload.user.id viene del token generado en login
            const user = await User.findById(payload.user.id).select('-password');
            if (!user) return done(null, false, { message: 'Token user not found' });
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));

    // 🔹 Alias para reutilizar la estrategia JWT en /current
    passport.use('current', passport._strategy('jwt'));
}
