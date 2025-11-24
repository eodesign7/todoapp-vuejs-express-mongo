import mongoose from "mongoose";

export const connectDB = async (uri: string): Promise<void> => {
     try {
          await mongoose.connect(uri, {
               // Optional: moderné nastavenia mongoose
               // useNewUrlParser: true, // od mongoose 6 už default
               // useUnifiedTopology: true, // od mongoose 6 už default
          });
          console.log("[DB]: ✅ MongoDB connected");
     } catch (error) {
          console.error("[DB]: ❌ MongoDB connection error:", error);
          throw error; // nech server.ts vie, že sa niečo pokazilo
     }
};
