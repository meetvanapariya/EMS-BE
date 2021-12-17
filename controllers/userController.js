import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decryptionAES , encryptAES } from "../validators/dataEncryption.js";

import jsonResponse from '../utils/json-response.js';
import responseCodes from '../helpers/response-codes.js';
import {successMessages , errorMessages }  from '../utils/response-message.js';
import bcrypt from 'bcryptjs';

// registerUser POST request controller
export const registerUser = async (req, res) => {
  // destructuring every data from request body
  const { first_name, last_name,user_role , user_role_id , current_address, permanent_address,profile_image,blood_group , EMPID, phone, alternate_mobile_no, notes,employment_start_date,employment_end_date,user_birth_date, last_login, user_department,user_designation,adharcard_no,bank_ac, email, password } = req.body;
  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        if (user.paranoid == true) {
          return res.status(200).json({
            error: "",
            payload: {},
            message: "User found in paranoid mode",
            status: 200,
          });
        }
        return res.status(400).json({
          error: "",
          payload: {},
          message: "User already exists ",
          status: 400,
        });
      }
      if (!user) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          first_name,
          last_name,
          username : first_name+last_name,
          user_role,
          user_role_id,
          current_address : encryptAES(current_address),
          permanent_address : encryptAES(permanent_address),
          account_enabled : 'yes',
          profile_image,
          blood_group,
          EMPID,
          phone :encryptAES(phone),
          alternate_mobile_no :encryptAES(alternate_mobile_no),
          notes,
          notify_online : 'yes',
          employment_start_date,
          employment_end_date,
          user_birth_date,
          last_login,
          status : '',
          user_department,
          user_designation,
          resetPasswordToken : '',
          resetPasswordExpires : '',
          adharcard_no : encryptAES(adharcard_no),
          bank_ac :encryptAES(bank_ac),
          email: email.toLowerCase(),
          password: encryptedPassword,
        });
        if (newUser) {
          const token = generateToken(newUser._id, email);
          newUser.current_address =  decryptionAES(newUser.current_address);
          newUser.permanent_address =  decryptionAES(newUser.permanent_address);
          newUser.phone = decryptionAES(newUser.phone);
          newUser.alternate_mobile_no = decryptionAES(newUser.alternate_mobile_no);
          newUser.adharcard_no =  decryptionAES(newUser.adharcard_no);
          newUser.bank_ac = decryptionAES(newUser.bank_ac);
          newUser.token = token;
          return jsonResponse(res, responseCodes.OK, errorMessages.noError, newUser, successMessages.Create);
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "Some error occurred while registering user",
      status: 400,
    });
  }
};

// loginUser POST request controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // finding user based on provided email from db
  User.findOne({ email }).exec(async (error, user) => {
    // checking if user is paranoid or not , if paranoid then return error message to client
    if (error || !user || !user.paranoid == false) {
      return res.status(400).json({
        error: error?.message,
        payload: {},
        message: "User with this email does not exist. Please register first",
        status: 400,
      });
    }
    // if user is not paranoid then checking if provided password and email does match or not, if not then return error message to client
    // if (!user.matchPassword(password)) {
    //   return res.json({
    //     error: "Email & Password do not match",
    //     payload: {},
    //     message: "",
    //     status: 400,
    //   });
    // }
    // // if email and password get matched then generating a token to send client
    // const token = generateToken(user);
    // const { _id, username, email, user_role } = user;
    // res.status(200).json({
    //   error: "",
    //   payload: {
    //     id: _id,
    //     username,
    //     email,
    //     user_role,
    //     token,
    //   },
    //   message: "User Login successfully",
    //   status: 200,
    // });
    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(user._id, email);
      user.current_address =  decryptionAES(user.current_address);
      user.permanent_address =  decryptionAES(user.permanent_address);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.adharcard_no =  decryptionAES(user.adharcard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      user.token = token;
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, user, successMessages.Login);
    }else{
      return jsonResponse(res, responseCodes.Invalid, errorMessages.invalidPassword, {});
    }
  });
};

// getAllUser GET request controller
export const getAllUsers = async (req, res) => {
  try {
    // filtering out paranoid users
    const user = await User.find({paranoid : false});
    // if user does not found then return error message
    if (!user.length > 0) {
      return res.status(400).json({
        error: "No user found",
        payload: {},
        message: "",
        status: 400,
      });
    }
    // if user found who is not paranoid then decrypt its data
    let response = user.map(
      ({
        _id,
        first_name,
        last_name,
        username,
        user_role,
        user_role_id,
        current_address,
        permanent_address,
        account_enabled,
        profile_image,
        blood_group,
        EMP_ID,
        phone,
        alternate_mobile_no,
        notes,
        notify_online,
        employment_start_date,
        employment_end_date,
        user_birth_date,
        last_login,
        userStatus,
        user_department,
        user_designation,
        resetPasswordToken,
        resetPasswordExpires,
        adharaCard_no,
        bank_ac,
        email,
        password,
      }) => {
        let decUser = {
          _id,
          first_name,
          last_name,
          username,
          user_role,
          user_role_id,
          current_address: decryptionAES(current_address),
          permanent_address: decryptionAES(permanent_address),
          account_enabled,
          profile_image,
          blood_group,
          EMP_ID,
          phone: decryptionAES(phone),
          alternate_mobile_no: decryptionAES(alternate_mobile_no),
          notes,
          notify_online,
          employment_start_date,
          employment_end_date,
          user_birth_date,
          last_login,
          userStatus,
          user_department,
          user_designation,
          resetPasswordToken,
          resetPasswordExpires,
          adharaCard_no: decryptionAES(adharaCard_no),
          bank_ac: decryptionAES(bank_ac),
          email,
          password,
        };
        return decUser;
      }
    );
    // returning list of decrypted non paranoid users here
    res.json({
      error: "",
      payload: response,
      message: "Successfully fetched all users.",
      status: 200,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "some error occurred while fetching all users from database. ",
      status: 400,
    });
  }
};

// getUser GET request controller
export const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    // checking if selected user is paranoid or not
    if (user.paranoid === false) {
      // if user is not paranoid then decrypt its data and send to client
      user.adharaCard_no = decryptionAES(user.adharaCard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.current_address = decryptionAES(user.current_address);
      user.permanent_address = decryptionAES(user.permanent_address);
      res.json({
        error: "",
        payload: user,
        message: "Successfully fetch one user.",
        status: 200,
      });
    } else {
      res.json({
        error: "User does not exists.",
        payload: {},
        message: "",
        status: 400,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "some error occurred while fetching user from database. ",
      status: 400,
    });
  }
};

// deleteUser PATCH request controller
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // try to find and softDelete user with provided user_id from database
    const user = await User.findByIdAndUpdate({ _id: userId }, req.body);

    // if user not found in database then return error message to client
    if (!user) {
      return res.json({
        error: "User not found",
        payload: {},
        message: "",
        status: 400,
      });
    }

    // if user is successfully soft deleted then return success message to client
    return res.json({
      error: "",
      payload: user,
      message: "User deleted successfully.",
      status: 200,
    });
  } catch (error) {
   return res.json({
      error: error.message,
      payload: {},
      message: "Please provide proper user id",
      status: 400,
    });
  }
};

// Update user PATCH request controller
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // try to find user in db with provided user_id
    User.findById(userId).exec(async (err, user) => {
      //checking if user is paranoid then return not found message to client
      if (err || !user.paranoid == false) {
        return res.json({
          error: err?.message,
          payload: {},
          message: "User not found",
          status: 400,
        });
      }

      // checking if user is not paranoid then try to update user accordingly req.body
      if (user.paranoid == false) {
        const user = await User.findByIdAndUpdate({ _id: userId }, req.body);
        return res.json({
          error: "",
          payload: user,
          message: "User updated successfully.",
          status: 200,
        });
      }
    });
  } catch (error) {
    res.json({
      error: error.message,
      payload: {},
      message: "Please provide proper data",
      status: 400,
    });
  }
};


export const updateProfilePic = async(req,res) => {
    const file = req.file;
    const { user_id } = req.body;
    if (!(user_id)) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    User.findByIdAndUpdate(user_id ,{profile_image : file.path}) 
    .then(() => {
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, {}, successMessages.profileSaved);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
}

export const forgetPassword = async(req,res) => {
  const { email } = req.body;
  if (!(email)) {
    return jsonResponse(res, responseCodes.Invalid, errorMessages.missingParameter, {});
   }
   const response = await User.findOne({email});
   if(response){
     if(response.email == email){
      const token = generateToken(response._id, response.email);
      const link = `www.xyz.com/reset-password?token=${token}&id=${response._id}`;
      return jsonResponse(res, responseCodes.OK, errorMessages.noError,link, successMessages.ForgotPassword);
     }else{
      return jsonResponse(res, responseCodes.Invalid, errorMessages.noEmailFound, {});   
     }
   }else{
    return jsonResponse(res, responseCodes.Invalid, errorMessages.noEmailFound, {});
   }
}

export const resetPassword = async(req,res) => {
  const { password , user_id , token} = req.body;
  if (!(password && user_id && token)) {
    return jsonResponse(res, responseCodes.Invalid, errorMessages.missingParameter, {});
   }
   encryptedPassword = await bcrypt.hash(password, 10);

   User.findByIdAndUpdate(user_id ,{password : encryptedPassword , resetPasswordToken : token}) 
   .then(() => {
     return jsonResponse(res, responseCodes.OK, errorMessages.noError, {}, successMessages.Update);
   }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
}