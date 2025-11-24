import { Request, Response } from "express";
import Todo from "@/models/Todo";

// Vráti všetky todos aktuálne prihláseného používateľa.
export const getTodos = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ todos });
    } catch (error) {
        console.error("[Todos:get]", error);
        res.status(500).json({ message: "Nepodarilo sa načítať úlohy." });
    }
};

// Vytvorí nové todo priradené k používateľovi.
export const createTodo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const todo = new Todo({ ...req.body, user: userId });
        await todo.save();
        res.status(201).json({ todo });
    } catch (error) {
        console.error("[Todos:create]", error);
        res.status(500).json({ message: "Nepodarilo sa vytvoriť úlohu." });
    }
};

// Aktualizuje existujúce todo, ak patrí používateľovi.
export const updateTodo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const { id } = req.params;
        const todo = await Todo.findOneAndUpdate({ _id: id, user: userId }, req.body, {
            new: true,
        });
        if (!todo) return res.status(404).json({ message: "Úloha neexistuje." });
        res.json({ todo });
    } catch (error) {
        console.error("[Todos:update]", error);
        res.status(500).json({ message: "Nepodarilo sa upraviť úlohu." });
    }
};

// Zmaže todo, ak patrí používateľovi.
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
        if (!todo) return res.status(404).json({ message: "Úloha neexistuje." });
        res.status(204).send();
    } catch (error) {
        console.error("[Todos:delete]", error);
        res.status(500).json({ message: "Nepodarilo sa zmazať úlohu." });
    }
};

