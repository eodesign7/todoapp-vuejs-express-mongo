import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Please set it in backend/.env");
}

// Generuje podpísané JWT pre daného používateľa.
const buildToken = (userId: string) =>
    jwt.sign({ id: userId }, JWT_SECRET!, {
        expiresIn: "1d",
    });

// Uprace user objekt tak, aby FE nikdy nevidel ObjectId ani citlivé polia.
const sanitizeUser = (user: { _id: Types.ObjectId | string; email: string }) => ({
    _id: user._id.toString(),
    email: user.email,
});

// Jednoduchá validácia prihlasovacích údajov pre register/login.
const validateCredentials = (email?: string, password?: string) => {
    if (!email || !password) {
        return "Email aj heslo sú povinné.";
    }
    if (password.length < 8) {
        return "Heslo musí mať aspoň 8 znakov.";
    }
    return null;
};

// Vytvorí nového používateľa, uloží ho a vráti JWT + bezpečné info.
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const validationError = validateCredentials(email, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email už existuje." });
        }

        const user = new User({ email, password });
        await user.save();

        const token = buildToken(user._id.toString());
        res.status(201).json({
            message: "Používateľ bol vytvorený.",
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("[Register]", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Overí existujúceho používateľa pomocou bcryptu a vráti JWT.
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const validationError = validateCredentials(email, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Nesprávne prihlasovacie údaje." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Nesprávne prihlasovacie údaje." });
        }

        const token = buildToken(user._id.toString());
        res.json({
            message: "Prihlásenie úspešné.",
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("[Login]", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Vráti aktuálneho používateľa, ktorého pridal auth middleware.
export const me = async (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
};

// Symetrický endpoint k loginu; FE rieši zmazanie tokenu.
export const logout = async (_req: Request, res: Response) => {
    res.json({ message: "Používateľ odhlásený." });
};
