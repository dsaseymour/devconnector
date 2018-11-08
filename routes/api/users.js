//app.use('/api/users', users)

const express = require("express");
const router = express.Router();

//@router GET api/users/test
// @desc tests users route
//@access Public       we want private routes because for some routes we only want logged in users to have access
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
}); //  /api/users/test       http://localhost:5000/api/users/test

module.exports = router;
