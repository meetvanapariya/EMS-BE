const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name:  
  {
    type: String, 
    lowercase: true
  },
  last_name:  
  {
    type: String, 
    lowercase: true
  },
  username :  
  {
    type: String, 
    lowercase: true
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
  EMPID: {
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
  employment_start_date:  {
    type: Date,
    default: "",
  },
  employment_end_date:  {
    type: Date,
    default: "",
  },
  user_birth_date:  {
    type: Date,
    default: "",
  },
  last_login: {
    type: Date,
    default: "",
  },
  status: {
    type: String,
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
  resetPasswordToken:  {
    type: String,
    default: "",
  },
  resetPasswordExpires: {
    type: Date,
    default: "",
  },
  adharcard_no: 
  {
    type: String,
    default:null
  },
  bank_ac: {
    type: String,
    default:null
  },
  is_delete : {
    type: Boolean
  },
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  password: { type: String },
  token: { type: String },
},{timestamps:true});

const User = mongoose.model("User", userSchema);
module.exports = User;