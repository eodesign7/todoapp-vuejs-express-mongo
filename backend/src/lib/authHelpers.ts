import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Please set it in backend/.env");
}

// Generuje podpísané JWT pre daného používateľa.
export const buildToken = (userId: string) =>
    jwt.sign({ id: userId }, JWT_SECRET!, {
        expiresIn: "1d",
    });

// Uprace user objekt tak, aby FE nikdy nevidel ObjectId ani citlivé polia.
export const sanitizeUser = (user: { _id: Types.ObjectId | string; email: string }) => ({
    _id: user._id.toString(),
    email: user.email,
});

// Jednoduchá validácia prihlasovacích údajov pre register/login.
export const validateCredentials = (email?: string, password?: string) => {
    if (!email || !password) {
        return "Email aj heslo sú povinné.";
    }
    if (password.length < 8) {
        return "Heslo musí mať aspoň 8 znakov.";
    }
    return null;
};

