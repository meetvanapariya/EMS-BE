import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    leave_type: {
      type: String,
      enum: [
        "casual_leave",
        "maternity_leave",
        "medical_leave",
        "marriage_leave",
        "loss_of_pay",
      ],
      default: "",
    },
    date: [],
    from_date: {
      type: Date,
      default: "",
    },
    to_date: {
      type: Date,
      default: "",
    },
    number_of_days: {
      type: String,
      default: "",
    },
    remaining_leave: {
      type: String,
      default: "",
    },
    leave_reason: {
      type: String,
      default: "",
    },
    approved_by_id: {
      type: String,
      default: "",
    },
    leave_day_type: {
      type: String,
      enum: ["full", "half"],
      default: "",
    },
    status: {
      // enum: [
      //   "new",
      //   "pending",
      //   "approved",
      //   "declined",
      //   "delete",
      //   "partial_approved",
      // ],
      // default: "new",
    },
    notes: {
      type: String,
      default: "",
    },
    user_role: {
      type: String,
      enum: ["Admin", "Manager", "Team Leader", "Developer", "HR"],
      default: "Developer",
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
