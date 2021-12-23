import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environmentVariables.js";
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: "2h",
  });
};
export default generateToken;
