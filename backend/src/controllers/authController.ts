import { Request, Response } from "express";
import User from "@/models/User";
import { buildToken, sanitizeUser, validateCredentials } from "@/lib/authHelpers";

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
