import { Leave } from "../models/leaveModel.js";
import jsonResponse from '../utils/json-response.js';
import responseCodes from '../helpers/response-codes.js';
import {successMessages , errorMessages }  from '../utils/response-message.js';


export const addLeave = async (req, res) => {
    const {user_id , leave_type ,from_date , to_date ,number_of_days , remaining_leave , leave_reason ,approved_by_id ,leave_day_type ,status } = req.body;
    if(!(user_id && leave_type && from_date && to_date && leave_reason )){
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    const newLeave = new Leave({
        user_id,
        leave_type,
        from_date,
        to_date,
        number_of_days,
        remaining_leave,
        leave_reason,
        approved_by_id : '',
        leave_day_type,
        status
    });
    newLeave.save() 
    .then(() => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
};
  