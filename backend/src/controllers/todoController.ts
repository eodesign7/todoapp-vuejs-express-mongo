import { Request, Response } from "express";
import Todo from "@/models/Todo";

// Vráti všetky todos aktuálne prihláseného používateľa.
export const getTodos = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ todos });
};

// Vytvorí nové todo priradené k používateľovi.
export const createTodo = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const todo = new Todo({ ...req.body, user: userId });
    await todo.save();
    res.status(201).json({ todo });
};

// Aktualizuje existujúce todo, ak patrí používateľovi.
export const updateTodo = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { id } = req.params;
    const todo = await Todo.findOneAndUpdate({ _id: id, user: userId }, req.body, {
        new: true,
    });
    res.json({ todo });
};

// Zmaže todo, ak patrí používateľovi.
export const deleteTodo = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { id } = req.params;
    await Todo.findOneAndDelete({ _id: id, user: userId });
    res.status(204).send();
};

