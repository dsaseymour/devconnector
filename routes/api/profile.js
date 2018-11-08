//app.use('/api/profile', profile)

const express = require("express");
const router = express.Router();

//@router GET api/profile/test
// @desc tests profile route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile Works" });
}); //  /api/profile/test       http://localhost:5000/api/profile/test

module.exports = router;
