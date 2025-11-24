import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Register User
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if email already exists
        const isUser = await User.findOne({ email });
        if (isUser) return res.status(400).json({ message: "Email exists" });

        // Create new User
        const user = new User({
            email,
            password,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(201).json({ message: "User registered", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "No User" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid Password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ message: "User logged in", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const me = async (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
};

// Logout User
export const logout = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
};
