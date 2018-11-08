const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* //========================
//DB CONFIG BEGIN
//========================  */
const db = require("./config/keys").mongoURI; // our db variable
//connecting to mongodb
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Hey an Error occured" + err));
/* //========================
//DB CONFIG END
//========================  */

/* //========================
//ROUTING BEGIN
//========================  */
app.get("/", (req, res) => {
  res.send("Hello");
});

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

/* //========================
//ROUTING END
//========================  */

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
