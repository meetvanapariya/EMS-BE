import mongoose from "mongoose";
import { DATABASE_URL } from "./environmentVariables.js";

export const connectDB = () => {
  mongoose
    .connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
    });
};
