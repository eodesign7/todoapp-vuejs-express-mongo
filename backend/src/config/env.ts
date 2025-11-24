import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

if (!process.env.JWT_SECRET) {
    console.warn("[Env]: JWT_SECRET is not defined. Auth flow will fail.");
}
