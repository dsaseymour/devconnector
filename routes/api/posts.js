//app.use('/api/profile', profile)

const express = require("express");
const router = express.Router();

//@router GET api/posts/test
// @desc tests post route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile Works" });
}); //  /api/profile/test       http://localhost:5000/api/posts/test

module.exports = router;
