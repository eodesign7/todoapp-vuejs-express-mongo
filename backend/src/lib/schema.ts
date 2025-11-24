import { Schema } from "mongoose";
import { User } from "@/lib/types";

export const UserSchema = new Schema<User>({
     email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
     },
     password: {
          type: String,
          required: true,
          minlength: 8,
          select: false,
     },
});
