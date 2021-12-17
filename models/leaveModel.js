import  mongoose  from "mongoose";

const leaveSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: ''
      },    
      leave_type: {
        type: String,
        enum: ['CL', 'ML', 'LP'],
        default: ''
      },  
      from_date: {
        type: String,
        default: ""
      },    
      to_date: {
        type: String,
        default: ""
      },      
      number_of_days: {
        type: String,
        default: ''
      },        
      remaining_leave: {
        type: String,
        default: ''
      },    
      leave_reason: {
        type: String,
        default: ''
      },   
      approved_by_id: {
        type: String,
        default: ''
      },  
      leave_day_type: {
        type: String,
        enum: ['full', 'half'],
        default: ''
      },
      status: {
        type: String,
        enum: ['new', 'pending', 'approved', 'declined','delete'],
        default: 'new'
      }
},{timestamps:true});

export const Leave = mongoose.model("Leave", leaveSchema);