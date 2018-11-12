const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateProfileInput(data) {
  let errors = {};

  //INITIALIZING AS EMPTY STRINGS TO MAKE SURE THE VALIDATOR PACKAGE WORKS BEGINS
  data.handle = !isEmpty(data.handle) ? data.handle : ""; //if data is empty let it be an empty string
  data.status = !isEmpty(data.status) ? data.status : ""; //if data is empty let it be an empty string
  data.skills = !isEmpty(data.skills) ? data.skills : ""; //if data is empty let it be an empty string
  //INITIALIZING AS EMPTY STRINGS TO MAKE SURE THE VALIDATOR PACKAGE WORKS ENDS

  /* //========================
//VALIDATING REQUIRED FIELDS BEGINS 
//========================  */
  //HANDLE VALIDATION BEGINS---------------------------------------------------------------------------
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 and 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle is required";
  }
  //HANDLE VALIDATION ENDS---------------------------------------------------------------------------
  //STATUS VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }
  //STATUS VALIDATION ENDS---------------------------------------------------------------------------
  //SKILLS VALIDATION BEGINS---------------------------------------------------------------------------
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills are required";
  }
  //SKILLS VALIDATION ENDS---------------------------------------------------------------------------
  /* //========================
//VALIDATING REQUIRED FIELDS ENDS 
//========================  */
  /* //========================
//VALIDATING NON-REQUIRED FIELDS BEGINS 
//========================  */
  //URL FORMATTING VALIDATION BEGINS---------------------------------------------------------------------------
  /**We need to ensure that these fields are formatted as urls
   * first we have to check that they are not empty
   */
  if (!isEmpty(data.website)) {
    //if data.website is not empty
    if (!Validator.isURL(data.website)) {
      //if data.website is not a url
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    //if data.youtube is not empty
    if (!Validator.isURL(data.youtube)) {
      //if data.youtube is not a url
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    //if data.twitter is not empty
    if (!Validator.isURL(data.twitter)) {
      //if data.twitter is not a url
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    //if data.facebook is not empty
    if (!Validator.isURL(data.facebook)) {
      //if data.facebook is not a url
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    //if data.linkedin is not empty
    if (!Validator.isURL(data.linkedin)) {
      //if data.linkedin is not a url
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    //if data.instagram is not empty
    if (!Validator.isURL(data.instagram)) {
      //if data.instagram is not a url
      errors.instagram = "Not a valid URL";
    }
  }
  //URL FORMATTING VALIDATION ENDS---------------------------------------------------------------------------

  /* //========================
 //VALIDATING NON-REQUIRED FIELDS ENDS 
 //========================  */

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
//if all the tests pass errors will still be an empty object at the end of our validation sequence
