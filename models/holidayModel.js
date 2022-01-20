import mongoose from "mongoose";
const Schema = mongoose.Schema;

const holidaySchema = new mongoose.Schema(
  {
    holiday_name: {
      type: String,
      default: "",
    },
    holiday_date: {
      type: Date,
      default: "",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Holiday = mongoose.model("Holiday", holidaySchema);
