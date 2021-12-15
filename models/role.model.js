const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role_name : {
        type : String,
    },
    permission_read : {
        type:Boolean
    },
    permission_write : {
        type:Boolean
    },
    permission_access : {
        type:Boolean
    }
},{timestamps:true});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;