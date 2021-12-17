import  mongoose  from "mongoose";
const Schema = mongoose.Schema;

const holidaySchema = new mongoose.Schema({
    holiday_id:{
        type: String,
        default: "",
    },
    holiday_name:{
        type: String,
        default: "",
    },
    holiday_date:{
        type: String,
        default: "",
    },
    created_at:{
        type: Date,
        default: Date.now,
    }
},{timestamps:true});

export const Holiday = mongoose.model("Role", holidaySchema);