import { check } from "express-validator";

export const userRegisterValidators = [
  check("first_name", "First Name is required")
    .not()
    .isEmpty()
    .isLowercase()
    .withMessage("First Name must be in lowercase!"),
  check("last_name", "First Name is required")
    .not()
    .isEmpty()
    .isLowercase()
    .withMessage("Last Name must be in lowercase!"),
  check("user_birth_date", "Birth date is required").not().isEmpty(),
  check("email", "Must be a valid email address").isEmail(),
  check(
    "password",
    "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. "
  )
    .isLength({ min: 4 }),
    // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  check("permanent_address", "Address is required").not().isEmpty(),
];

export const userLoginValidators = [
  check("email", "Must be a valid email address").isEmail(),
  check(
    "password",
    "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. "
  )
    .isLength({ min: 4 })
    
];


export const userLogoutValidators = [
  check("user_id", "Require user ID")
  .not()
  .isEmpty()
];
