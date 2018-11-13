const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validatePostInput(data) {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : ""; //if data is empty let it be an empty string

  //TEXT VALIDATION BEGINS---------------------------------------------------------------------------
  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  //TEXT VALIDATION ENDS---------------------------------------------------------------------------

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
