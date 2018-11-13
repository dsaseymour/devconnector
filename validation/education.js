const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : ""; //if data is empty let it be an empty string
  data.degree = !isEmpty(data.degree) ? data.degree : ""; //if data is empty let it be an empty string
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ""; //if data is empty let it be an empty string
  data.from = !isEmpty(data.from) ? data.from : ""; //if data is empty let it be an empty string

  //SCHOOL VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }
  //SCHOOL VALIDATION ENDS---------------------------------------------------------------------------

  //DEGREE VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }
  //DEGREE VALIDATION ENDS---------------------------------------------------------------------------

  //FIELD OF STUDY VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of Study field is required";
  }
  //FIELD OF STUDY VALIDATION ENDS---------------------------------------------------------------------------

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
