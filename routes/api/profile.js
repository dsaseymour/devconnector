//app.use('/api/profile', profile)
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");

/* //========================
//GET  /TEST BEGINS 
//========================  */
//@router GET api/profile/test
// @desc tests profile route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile Works" });
}); //  /api/profile/test       http://localhost:5000/api/profile/test
/* //========================
//GET  /TEST ENDS 
//========================  */

/* //========================
//GET  / BEGINS 
//========================  */
//@router GET api/profile
// @desc get current users profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  / ENDS 
//========================  */

/* //========================
//POST  / BEGINS 
//========================  */
//@router POST api/profile
// @desc create or Edit user profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Validation Begins-------------------------
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors); //returns errors with 400 status
    }
    //Validation Ends-------------------------
    //Loading Profile Fields with data Begins-------------------------
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    //skills begins
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(","); //array of skills
    //skills ends
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //social begins
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    //social ends
    if (req.body.date) profileFields.date = req.body.date;
    //Loading Profile Fields with data  Ends-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //if a profile already exists then this is an update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //a profile does not exist we are creating one
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
); //  /api/profile/      http://localhost:5000/api/profile/
/* //========================
//POST  / ENDS
//========================  */

module.exports = router;
