import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../models/user.model.js"; 

const JWT_SECRET = process.env.JWT_SECRET || "c3l3r1umSuperSecretKey2025";

export default function initializePassport() {

    // Login con email y password

    passport.use(
        "local",
        new LocalStrategy(
            { usernameField: "email", passwordField: "password", session: false },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email: email.toLowerCase() });
                    if (!user) {
                        console.log("❌ Usuario no encontrado:", email);
                        return done(null, false, { message: "User not found" });
                    }

                    const isValid = bcrypt.compareSync(password, user.password);
                    if (!isValid) {
                        console.log("❌ Contraseña inválida para:", email);
                        return done(null, false, { message: "Invalid credentials" });
                    }

                    console.log("✅ Login correcto:", user.email);
                    return done(null, user);
                } catch (err) {
                    console.error("Error en estrategia local:", err);
                    return done(err);
                }
            }
        )
    );

    // Validar token

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    };

    passport.use(
        "jwt",
        new JwtStrategy(jwtOptions, async (payload, done) => {
            try {
                const user = await User.findById(payload.id).select("-password");
                if (!user) {
                    return done(null, false, { message: "Token user not found" });
                }
                return done(null, user);
            } catch (err) {
                console.error("Error en estrategia JWT:", err);
                return done(err, false);
            }
        })
    );

    passport.use("current", passport._strategy("jwt"));
}