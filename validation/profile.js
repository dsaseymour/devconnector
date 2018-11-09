const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateProfileInput(data) {
  let errors = {};

  //INITIALIZING AS EMPTY STRINGS TO MAKE SURE THE VALIDATOR PACKAGE WORKS BEGINS
  data.handle = !isEmpty(data.handle) ? data.handle : ""; //if data is empty let it be an empty string
  data.status = !isEmpty(data.status) ? data.status : ""; //if data is empty let it be an empty string

  //INITIALIZING AS EMPTY STRINGS TO MAKE SURE THE VALIDATOR PACKAGE WORKS ENDS

  //EMAIL VALIDATION BEGINS---------------------------------------------------------------------------
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  //EMAIL VALIDATION ENDS---------------------------------------------------------------------------
  //PASSWORD VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  //PASSWORD VALIDATION ENDS---------------------------------------------------------------------------

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
