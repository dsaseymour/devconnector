const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateExperienceInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : ""; //if data is empty let it be an empty string
  data.company = !isEmpty(data.company) ? data.company : ""; //if data is empty let it be an empty string
  data.from = !isEmpty(data.from) ? data.from : ""; //if data is empty let it be an empty string

  //TITLE VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  //TITLE VALIDATION ENDS---------------------------------------------------------------------------

  //COMPANY VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  //COMPANY VALIDATION ENDS---------------------------------------------------------------------------

  //FROM VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  }
  //FROM VALIDATION ENDS---------------------------------------------------------------------------

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
