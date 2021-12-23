import express from "express";
import { verifyToken } from "../middlewares/tokenAuth.js";
import { canAccess } from "../middlewares/roleAuth.js";

import {
  getBirthdays,
  getHolidays,
  getLeaves,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/holidays", verifyToken, getHolidays);

router.get("/birthdays", verifyToken, getBirthdays);

router.get("/leaves/:userId", verifyToken, canAccess, getLeaves);
export default router;
