const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : ""; //if data is empty let it be an empty string
  data.password = !isEmpty(data.password) ? data.password : ""; //if data is empty let it be an empty string

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
