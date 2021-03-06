//app.use('/api/profile', profile)
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

/* //========================================================================================================================
//GET  ROUTES BEGIN 
//========================================================================================================================*/
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
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
    //Profile Find Ends-------------------------
  }
); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  / ENDS 
//========================  */

/* //========================
//GET  /profile/handle/<actualhandle> BEGINS 
//========================  */
//@router GET /profile/handle/<actualhandle>
// @desc get user profile by handle
//@access Public     anyone can see profiles
//we don't need passport middleware since its public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  //Profile Find Begins-------------------------
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile =
          "There is no profile matching the handle given for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({
        profile: "There is no profile matching the handle given for this user"
      })
    );
  //Profile Find Begins-------------------------
}); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  /profile/handle/<actualhandle> ENDS 
//========================  */

/* //========================
//GET  api/profile/user/:user_id BEGINS 
//========================  */
//@router GET api/profile/user/:user_id
// @desc get user profile by id
//@access Public     anyone can see profiles
//we don't need passport middleware since its public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  //Profile Find Begins-------------------------
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile =
          "There is no profile matching the id given for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({
        profile: "There is no profile matching the id given for this user"
      })
    );
  //Profile Find Ends-------------------------
}); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  api/profile/user/:user_id ENDS 
//========================  */

/* //========================
//GET  api/profile/all
//========================  */
//@router GET api/profile/all
// @desc get all profiles
//@access Public     anyone can see profiles
//we don't need passport middleware since its public
router.get("/all", (req, res) => {
  const errors = {};
  //Profile Find Begins-------------------------
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles currently";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({
        profile: "There are no profiles currently"
      })
    );
  //Profile Find Ends-------------------------
}); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  api/profile/all ENDS 
//========================  */

/* //========================================================================================================================
//GET  ROUTES END 
//========================================================================================================================*/

/* //========================================================================================================================
//POST  ROUTES BEGIN 
//========================================================================================================================*/
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
    //Profile Find Begins-------------------------
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
    //Profile Find Ends-------------------------
  }
); //  /api/profile/      http://localhost:5000/api/profile/
/* //========================
//POST  / ENDS
//========================  */

/* //========================
//POST  /experience BEGINS 
//========================  */
//@router POST api/profile/experience
// @desc add experience to profile
//@access Privat
router.post(
  "/experience",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Validation Begins-------------------------
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors); //returns errors with 400 status
    }
    //Validation Ends-------------------------
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //if the profile exists
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        //add to experience array
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));
      } else {
        //a profile does not exist
        errors.handle = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/experience      http://localhost:5000/api/profile/experience
/* //========================
//POST  /experience ENDS
//========================  */

/* //========================
//POST  /education BEGINS 
//========================  */
//@router POST api/profile/education
// @desc add education to profile
//@access Private
router.post(
  "/education",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Validation Begins-------------------------
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors); //returns errors with 400 status
    }
    //Validation Ends-------------------------
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //if the profile exists
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        //add to education array
        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
      } else {
        //a profile does not exist
        errors.handle = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/education      http://localhost:5000/api/profile/education
/* //========================
//POST  /education ENDS
//========================  */

/* //========================================================================================================================
//POST ROUTES END 
//========================================================================================================================*/

/* //========================================================================================================================
//DELETE  ROUTES BEGIN 
//========================================================================================================================*/
/* //========================
//DELETE  /experience BEGINS 
//========================  */
//@router DELETE api/profile/experience/: exp_id
// @desc Delete experience from profile
//@access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //get experience removal index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id); // get the correct experience to delete
        profile.experience.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      } else {
        //a profile does not exist
        errors.deleteexperience = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/experience      http://localhost:5000/api/profile/experience
/* //========================
//DELETE  /experience ENDS
//========================  */

/* //========================
//DELETE  /education BEGINS 
//========================  */
//@router DELETE api/profile/education/: edu_id
// @desc Delete education from profile
//@access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //get education removal index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id); // get the correct education to delete
        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      } else {
        //a profile does not exist
        errors.handle = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/education      http://localhost:5000/api/profile/education
/* //========================
//DELETE  /education ENDS
//========================  */

/* //========================
//DELETE  /profile BEGINS 
//========================  */
//@router DELETE api/profile/education/: edu_id
// @desc delete user and profile
//@access Private
router.delete(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Profile Find Begins-------------------------
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/      http://localhost:5000/api/profile/
/* //========================
//DELETE  /profile ENDS
//========================  */

/* //========================================================================================================================
//DELETE ROUTES END 
//========================================================================================================================*/

module.exports = router;
