const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 3 characters";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
