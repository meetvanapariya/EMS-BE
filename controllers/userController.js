import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decryptionAES, encryptAES } from "../validators/dataEncryption.js";

import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";
import bcrypt from "bcryptjs";
import codes from "../helpers/response-codes.js";

// registerUser POST request controller
export const registerUser = async (req, res) => {
  // destructuring every data from request body
  const {
    first_name,
    last_name,
    user_role,
    user_role_id,
    current_address,
    permanent_address,
    profile_image,
    blood_group,
    EMP_ID,
    phone,
    alternate_mobile_no,
    notes,
    employment_start_date,
    employment_end_date,
    user_birth_date,
    last_login,
    user_department,
    user_designation,
    adharcard_no,
    bank_ac,
    email,
    password,
    meta,
  } = req.body;
  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        if (user.paranoid == true) {
          return jsonResponse(
            res,
            codes.BadRequest,
            errorMessages.ParanoidUser,
            {},
            successMessages.noMessage
          );
        }
        return jsonResponse(
          res,
          codes.BadRequest,
          errorMessages.userExists,
          {},
          successMessages.noMessage
        );
      }
      if (!user) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          first_name,
          last_name,
          username: `${first_name} + '' +  ${last_name}`,
          user_role,
          user_role_id,
          current_address,
          permanent_address,
          account_enabled: "yes",
          profile_image,
          blood_group,
          EMP_ID,
          phone,
          alternate_mobile_no,
          notes,
          notify_online: "yes",
          employment_start_date,
          employment_end_date,
          user_birth_date,
          last_login,
          status: "",
          user_department,
          user_designation,
          resetPasswordToken: "",
          resetPasswordExpires: "",
          adharcard_no,
          meta,
          bank_ac,
          email: email.toLowerCase(),
          password: encryptedPassword,
        });
        if (newUser) {
          const token = generateToken(newUser._id, email, newUser.user_role);
          newUser.current_address = decryptionAES(newUser.current_address);
          newUser.permanent_address = decryptionAES(newUser.permanent_address);
          newUser.phone = decryptionAES(newUser.phone);
          newUser.alternate_mobile_no = decryptionAES(
            newUser.alternate_mobile_no
          );
          newUser.adharcard_no = decryptionAES(newUser.adharcard_no);
          newUser.bank_ac = decryptionAES(newUser.bank_ac);
          newUser.token = token;
          return jsonResponse(
            res,
            responseCodes.OK,
            errorMessages.noError,
            newUser,
            successMessages.Create
          );
        }
      }
    });
  } catch (error) {
    jsonResponse(res, codes.BadRequest, error, {}, {});
  }
};

// loginUser POST request controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // finding user based on provided email from db
  User.findOne({ email }).exec(async (error, user) => {
    // checking if user is paranoid or not , if paranoid then return error message to client
    if (error || !user || !user.paranoid == false) {
      return jsonResponse(
        res,
        responseCodes.BadRequest,
        errorMessages.unverifiedUser,
        {}
      );
    }
    await User.findByIdAndUpdate(
      { _id: user._id },
      { last_login: new Date(), userStatus: "active" }
    );
    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(user._id, email, user.user_role);
      user.current_address = decryptionAES(user.current_address);
      user.permanent_address = decryptionAES(user.permanent_address);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.adharcard_no = decryptionAES(user.adharcard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      user.token = token;
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        user,
        successMessages.Login
      );
    } else {
      return jsonResponse(
        res,
        responseCodes.Invalid,
        errorMessages.invalidPassword,
        {}
      );
    }
  });
};

// logout POST request controller
export const logOut = async (req, res) => {
  const { user_id } = req.body;
  User.findByIdAndUpdate({ _id: user_id }, { userStatus: "inactive" })
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Logout
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

// getAllUser GET request controller
export const getAllUsers = async (req, res) => {
  const { search_by_name, search_by_role } = req.query;
  const query = {
    paranoid: false,
  };
  if (search_by_name) {
    query["$or"] = [
      { first_name: search_by_name },
      { last_name: search_by_name },
    ];
  }
  if (search_by_role && search_by_role !== "All") {
    query["user_role"] = search_by_role;
  }
  try {
    // filtering out paranoid users
    const user = await User.find(query);
    // if user does not found then return error message
    // if (!user.length > 0) {
    //   return res.status(400).json({
    //     error: "No user found",
    //     payload: {},
    //     message: "",
    //     status: 400,
    //   });
    // }
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
        meta,
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
          meta,
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
      error: "some error occurred while fetching all users from database.",
      payload: {},
      message: " ",
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
      error: "some error occurred while fetching user from database.",
      payload: {},
      message: "",
      status: 400,
    });
  }
};

// deleteUser PATCH request controller
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // try to find and softDelete user with provided user_id from database
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { paranoid: true }
    );

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
    const file = req.file;
    const { userId } = req.params;
    const userData = req.body;
    const userInfo = JSON.parse(JSON.stringify(userData));
    // console.log(userInfo);
    // if (userInfo.constructor === Object && Object.keys(userInfo).length === 0) {
    //   return jsonResponse(
    //     res,
    //     responseCodes.Invalid,
    //     errorMessages.missingParameter,
    //     {}
    //   );
    // }
    // try to find user in db with provided user_id
    User.findById(userId).exec(async (err, user) => {
      //checking if user is paranoid then return not found message to client
      if (err || !user.paranoid == false) {
        return res.json({
          error: "",
          payload: {},
          message: "User not found",
          status: 400,
        });
      }
      // checking if user is not paranoid then try to update user accordingly req.body
      if (user.paranoid == false) {
        if (Object.keys(userInfo).length > 0) {
          await User.findByIdAndUpdate({ _id: userId }, userInfo);
        }
        if (file) {
          await User.findByIdAndUpdate(
            { _id: userId },
            { profile_image: file.path }
          );
        }
        const userData = await User.findOne({ _id: userId });
        userData.adharaCard_no = decryptionAES(userData.adharaCard_no);
        userData.bank_ac = decryptionAES(userData.bank_ac);
        userData.phone = decryptionAES(userData.phone);
        userData.alternate_mobile_no = decryptionAES(
          userData.alternate_mobile_no
        );
        userData.current_address = decryptionAES(userData.current_address);
        userData.permanent_address = decryptionAES(userData.permanent_address);
        return res.json({
          error: "",
          payload: userData,
          message: "User updated successfully.",
          status: 200,
        });
      }
    });
  } catch (error) {
    jsonResponse(res, responseCodes.Invalid, error, {});
  }
};

export const updateProfilePic = async (req, res) => {
  const file = req.file;
  const { user_id } = req.body;
  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  User.findByIdAndUpdate(user_id, { profile_image: file.path })
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.profileSaved
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return jsonResponse(
      res,
      responseCodes.Invalid,
      errorMessages.missingParameter,
      {}
    );
  }
  const response = await User.findOne({ email });
  if (response) {
    if (response.email == email) {
      const token = generateToken(response._id, response.email);
      const link = `www.xyz.com/reset-password?token=${token}&id=${response._id}`;
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        link,
        successMessages.ForgotPassword
      );
    } else {
      return jsonResponse(
        res,
        responseCodes.Invalid,
        errorMessages.noEmailFound,
        {}
      );
    }
  } else {
    return jsonResponse(
      res,
      responseCodes.Invalid,
      errorMessages.noEmailFound,
      {}
    );
  }
};

export const resetPassword = async (req, res) => {
  const { password, user_id, token } = req.body;
  if (!(password && user_id && token)) {
    return jsonResponse(
      res,
      responseCodes.Invalid,
      errorMessages.missingParameter,
      {}
    );
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  User.find({ _id: user_id })
    .then((userExist) => {
      if (userExist) {
        User.findByIdAndUpdate(user_id, {
          password: encryptedPassword,
          resetPasswordToken: token,
        })
          .then(() => {
            return jsonResponse(
              res,
              responseCodes.OK,
              errorMessages.noError,
              {},
              successMessages.Update
            );
          })
          .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
      }
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};
