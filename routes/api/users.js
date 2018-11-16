//app.use('/api/users', users)

const express = require("express");
const router = express.Router();
const User = require("../../models/User"); //import the model from User js
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/* //========================================================================================================================
//GET  ROUTES BEGIN 
//========================================================================================================================*/

/* //========================
//GET  / BEGINS
//========================  */
//@router GET api/users/test
// @desc tests users route
//@access Public       we want private routes because for some routes we only want logged in users to have access
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
}); //  /api/users/test       http://localhost:5000/api/users/test
/* //========================
//GET  / ENDS
//========================  */

/* //========================
//GET  /current BEGINS
//========================  */
//@router GET api/users/current
// @desc Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);
/* //========================
//GET  /current ENDS
//========================  */

/* //========================================================================================================================
//GET  ROUTES END 
//========================================================================================================================*/

/* //========================================================================================================================
//POST  ROUTES BEGIN 
//========================================================================================================================*/

/* //========================
//POST  /register BEGINS
//========================  */
//@router POST api/users/register
// @desc Register user
//@access Public
router.post("/register", (req, res) => {
  //Validation Begins----------------------------------------------------------------------
  const { errors, isValid } = validateRegisterInput(req.body);
  //if isvalid is false then there are errors
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Validation Ends------------------------------------------------------------------------
  //User Find Begins-------------------------
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(
        //passing gravatar email and options
        req.body.email,
        {
          s: "200",
          r: "pg",
          d: "mm"
        }
      );
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
  //User Find Ends-------------------------
}); //  api/users/register       http://localhost:5000/api/users/register
/* //========================
//POST  /register ENDS
//========================  */

/* //========================
//POST  /login BEGINS
//========================  */
//@router POST api/users/login
// @desc Login User / Returning JWToken
//@access Public
router.post("/login", (req, res) => {
  //Validation Begins----------------------------------------------------------------------
  const { errors, isValid } = validateLoginInput(req.body);
  //if isvalid is false then there are errors
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Validation Ends------------------------------------------------------------------------
  // a form will be sent with the user's email and password
  const email = req.body.email;
  const password = req.body.password;
  //find the user via email using the user model
  //find one gives us a promise but we need to define the next steps if the user is not found
  // if the user is not found we return a status code 404 with the message "User not found"
  //User Find Begins-------------------------
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //Use has been found
    //the password the user provides is plain text, the password in our database is hashed
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //the user provided the correct password we need to generate the token
        //we need to create and send a token
        //sign token
        //create the payload we will send to allow user identification once the token reaches the server
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //making the jwt payload
        //for our private key we are using values set in our keys file in the config folder
        //token expires in an hour
        //the callback is called with the decoded payload if the signature is valid
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: "1h" },
          (err, token) => {
            //sending the token
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        //the user provided password does not match
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
  //User Find Ends-------------------------
}); //  /api/users/login       http://localhost:5000/api/login
//we need passport in order to verify our token
/* //========================
//POST  /login ENDS
//========================  */

/* //========================================================================================================================
//POST ROUTES END 
//========================================================================================================================*/

module.exports = router;
