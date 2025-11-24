import mongoose from "mongoose";
import { TodoSchema } from "@/lib/schema";
import type { TodoDocument } from "@/lib/types";

const Todo = mongoose.model<TodoDocument>("Todo", TodoSchema);

export default Todo;

