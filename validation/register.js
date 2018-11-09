//TODO: double check validation order

const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : ""; //if data is empty let it be an empty string
  data.email = !isEmpty(data.email) ? data.email : ""; //if data is empty let it be an empty string
  data.password = !isEmpty(data.password) ? data.password : ""; //if data is empty let it be an empty string
  data.password2 = !isEmpty(data.password2) ? data.password2 : ""; //if data is empty let it be an empty string

  //NAME VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 3 characters";
  }

  //NAME VALIDATION ENDS---------------------------------------------------------------------------
  //EMAIL VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is invalid";
  }

  //EMAIL VALIDATION ENDS---------------------------------------------------------------------------
  //PASSWORD VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if ((!Validator.isLength(data.password), { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  //PASSWORD VALIDATION ENDS---------------------------------------------------------------------------

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
