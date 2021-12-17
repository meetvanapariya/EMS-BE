import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { encryptAES } from "../validators/dataEncryption.js";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      lowercase: true,
    },
    last_name: {
      type: String,
      lowercase: true,
    },
    username: {
      type: String,
      lowercase: true,
    },
    user_role: {
      type: String,
      enum: ["Admin", "PM", "Team Leader", "Developer"],
      default: "Admin",
    },
    user_role_id: {
      type: String,
      default: "",
    },
    current_address: {
      type: String,
      default: "",
    },
    permanent_address: {
      type: String,
      default: "",
    },
    account_enabled: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },
    profile_image: {
      type: String,
      default: "",
    },
    blood_group: {
      type: String,
      default: "",
    },
    EMP_ID: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    alternate_mobile_no: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    notify_online: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },
    employment_start_date: {
      type: Date,
      default: "",
    },
    employment_end_date: {
      type: Date,
      default: "",
    },
    user_birth_date: {
      type: Date,
      default: "",
    },
    last_login: {
      type: Date,
    },
    userStatus: {
      type: String,
      enum: ["active", "inactive", "delete"],
      default: "active",
    },
    user_department: {
      type: String,
      default: "",
    },
    user_designation: {
      type: String,
      default: "React.js Developer",
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: "",
    },
    adharaCard_no: {
      type: String,
      default: null,
    },
    bank_ac: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: { type: String },
    token: { type: String },
    paranoid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   this.permanent_address = encryptAES(this.permanent_address);
//   this.current_address = encryptAES(this.current_address);
//   this.adharaCard_no = encryptAES(this.adharaCard_no);
//   this.bank_ac = encryptAES(this.bank_ac);
//   this.phone = encryptAES(this.phone);
//   this.alternate_mobile_no = encryptAES(this.alternate_mobile_no);
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password); //here i have removed await
// };

export const User = mongoose.model("User", userSchema);
