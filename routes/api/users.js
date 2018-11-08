//app.use('/api/users', users)

const express = require("express");
const router = express.Router();
const User = require("../../models/User"); //import the model from User js
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//@router GET api/users/test
// @desc tests users route
//@access Public       we want private routes because for some routes we only want logged in users to have access
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
}); //  /api/users/test       http://localhost:5000/api/users/test

//@router POST api/users/register
// @desc Register user
//@access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
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
}); //  /api/users/test       http://localhost:5000/api/users/test

module.exports = router;
