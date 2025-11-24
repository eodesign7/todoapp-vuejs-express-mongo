import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserSchema } from "@/lib/schema";
import { User } from "@/lib/types";

// Hash password before save
UserSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
     next();
});

// Compare password
UserSchema.methods.comparePassword = function (candidatePassword: string) {
     return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<User>("User", UserSchema);
