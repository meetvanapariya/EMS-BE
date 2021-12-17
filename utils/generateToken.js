import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config/environmentVariables.js";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (user_id , email) => {
  return jwt.sign({ user_id,email },process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}
export default generateToken;
