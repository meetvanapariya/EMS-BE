import express from "express";
const router = express.Router();

import {
    addHoliday,
    getHoliday,
    editHoliday,
    filterHoliday
  } from "../controllers/holidayController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";

  
router.post(
    "/add",
    addHoliday
)
router.get(
  "/get",
  getHoliday
)
router.patch(
  "/edit/:holiday_id",
  editHoliday
)

router.post(
  "/filter",
  filterHoliday
)
export default router;
