import "./config/env";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import apiRouter from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRouter);

// Root Test
app.get("/", (_req, res) => res.json({ message: "👋 Hello from Server! 🌍" }));

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Async/Await approach vs. .then().catch()
const startServer = async () => {
    try {
        await connectDB(MONGO_URI);
        console.log("[Server]: ✅ Connected to MongoDB");

        app.listen(PORT, () =>
            console.log(`[Server]: Server is Running on Port ${PORT}`),
        );
    } catch (error) {
        console.error("[Server]: ❌ Failed to connect to MongoDB", error);
        process.exit(1); // zastaví server, ak DB nie je dostupná
    }
};

// Start server
startServer();
