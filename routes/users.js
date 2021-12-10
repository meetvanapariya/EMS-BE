const router = require('express').Router();
const bcrypt = require('bcryptjs');
const {encryptAES , decryptionAES} = require('../middleware/encrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const auth = require("../middleware/auth");
const generateToken = require("../middleware/generateToken");
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {successMessages , errorMessages }  = require('../utils/response-message');

router.route('/').get(auth, (req,res) =>{
    User.find()
    .then(users => {
      // console.log(users);
      let response = users.map(({_id , first_name, last_name,username ,user_role , user_role_id , current_address, permanent_address,account_enabled,profile_image,blood_group , EMPID, phone, alternate_mobile_no, notes,employment_start_date,employment_end_date,user_birth_date, last_login, user_department,user_designation,adharcard_no,bank_ac, email, createdAt  }) =>{
        let desuser = {
          _id,
          first_name,
          last_name,
          username,
          user_role,
          user_role_id,
          current_address : decryptionAES(current_address),
          permanent_address : decryptionAES(permanent_address),
          account_enabled,
          profile_image,
          blood_group,
          EMPID,
          phone :decryptionAES(phone),
          alternate_mobile_no :decryptionAES(alternate_mobile_no),
          notes,
          employment_start_date,
          employment_end_date,
          user_birth_date,
          last_login,
          user_department,
          user_designation,
          adharcard_no : decryptionAES(adharcard_no),
          bank_ac :decryptionAES(bank_ac),
          email: email.toLowerCase(),
          createdAt
        }
        return desuser;
      })
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, response, successMessages.Fetch);
    })
    .catch(err => jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{}));
});

router.route('/:id').get(auth, (req,res)=>{
  User.findById(req.params.id)
  .then(user => {
      user.current_address =  decryptionAES(user.current_address);
      user.permanent_address =  decryptionAES(user.permanent_address);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.adharcard_no =  decryptionAES(user.adharcard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, user, successMessages.Fetch);
  })
  .catch(err => jsonResponse(res, responseCodes.BadRequest,err,{}));
})

router.route('/register').post( async (req,res)=>{
      const { first_name, last_name,user_role , user_role_id , current_address, permanent_address,profile_image,blood_group , EMPID, phone, alternate_mobile_no, notes,employment_start_date,employment_end_date,user_birth_date, last_login, user_department,user_designation,adharcard_no,bank_ac, email, password } = req.body;
      if (!(email && password && first_name && last_name)) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
      }
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.duplicateUser,{})
      }
      encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
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
    newUser.save()
    .then((savedata) => {
          const token = generateToken(user._id, email);
          savedata.current_address =  decryptionAES(savedata.current_address);
          savedata.permanent_address =  decryptionAES(savedata.permanent_address);
          savedata.phone = decryptionAES(savedata.phone);
          savedata.alternate_mobile_no = decryptionAES(savedata.alternate_mobile_no);
          savedata.adharcard_no =  decryptionAES(savedata.adharcard_no);
          savedata.bank_ac = decryptionAES(savedata.bank_ac);
          savedata.token = token;
        return jsonResponse(res, responseCodes.OK, errorMessages.noError, savedata, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
})

router.route('/login').post( async (req,res)=>{
    const { email, password } = req.body;
    if (!(email && password)) {
     return jsonResponse(res, responseCodes.Invalid, errorMessages.missingParameter, {});
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, email);
      user.current_address =  decryptionAES(user.current_address);
      user.permanent_address =  decryptionAES(user.permanent_address);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.adharcard_no =  decryptionAES(user.adharcard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      user.token = token;
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, user, successMessages.Login);
    }
    return jsonResponse(res, responseCodes.Invalid, errorMessages.invalidPassword, {});
});

module.exports = router;