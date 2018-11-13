//app.use('/api/profile', profile)
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

/* //========================================================================================================================
//GET  ROUTES BEGIN 
//========================================================================================================================*/
//@router GET api/posts/test
// @desc tests post route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Post Works" });
}); //  /api/profile/test       http://localhost:5000/api/posts/test

/* //========================
//GET  / BEGINS 
//========================  */
//@router GET api/posts
// @desc get all posts
//@access Public
router.get("/", (req, res) => {
  const errors = {};
  //Post Find Begins-------------------------
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res
        .status(404)
        .json(err)
        .json({ nopostsfound: "no posts found" })
    );
  //Post Find Ends-------------------------
}); //  /api/profile/      http://localhost:5000/api/profile/test
/* //========================
//GET  / ENDS 
//========================  */

/* //========================
//GET  /posts/:id BEGINS 
//========================  */
//@router GET /posts/:id
// @desc Get post by id
//@access Public
//we don't need passport middleware since its public
router.get("/:id", (req, res) => {
  //Profile Find Begins-------------------------
  Profile.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "no post found with that ID" })
    );
  //Profile Find Begins-------------------------
}); //  /api/profile/      http://localhost:5000/api/posts/:id
/* //========================
//GET  /posts/:id ENDS 
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
//@router POST api/posts
// @desc create Post
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Validation Begins-------------------------
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors); //returns errors with 400 status
    }
    //Validation Ends-------------------------

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
); //  /api/posts      http://localhost:5000/api/posts
/* //========================
//POST  / ENDS
//========================  */

/* //========================
//POST  /like/:id BEGINS 
//========================  */
//@router POST api/posts
// @desc Like Post
//@access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: "User already liked this post" });
            }

            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });

            post.save().then(post => res.json(post));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      } else {
        //a Profile does not exist
        errors.postdelete = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/posts/like/:id      http://localhost:5000/api/posts/like/:id
/* //========================
//POST  /like/:id ENDS
//========================  */

/* //========================
//POST  /unlike/:id BEGINS 
//========================  */
//@router POST api/posts
// @desc Unlike Post
//@access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Profile Find Begins-------------------------
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length === 0
            ) {
              return res
                .status(400)
                .json({ notliked: "You haven't liked this post" });
            }

            // Get remove index
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      } else {
        //a Profile does not exist
        errors.postdelete = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/posts/like/:id      http://localhost:5000/api/posts/like/:id
/* //========================
//POST  /unlike/:id ENDS
//========================  */

/* //========================
//POST  api/posts/comment/:id BEGINS 
//========================  */
//@router POST api/posts
// @desc Add Commennt to post
//@access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Validation Begins-------------------------
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors); //returns errors with 400 status
    }
    //Validation Ends-------------------------
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
); //  api/posts/comment/:id      http://localhost:5000/api/posts/comment/:id
/* //========================
//POST  api/posts/comment/:id ENDS
//========================  */

/* //========================================================================================================================
//POST ROUTES END 
//========================================================================================================================*/

/* //========================================================================================================================
//DELETE  ROUTES BEGIN 
//========================================================================================================================*/

/* //========================
//DELETE  /posts BEGINS 
//========================  */
//@router DELETE api/posts/:id
// @desc Delete post
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Profile Find Begins-------------------------
    //make sure the user that is the deleting the post is the author of the post
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //get post removal index
        Post.findById(req.params.id)
          .then(post => {
            if (post.user.toString() !== req.user.id) {
              //this user is not the author of the post
              errors.deletePost = "User not authorized";
              return res.status(400).json(errors);
            }
            //this is the author of the post
            post.remove().then(() => res.json({ success: true }));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No post found" })
          ); // get the correct post to delete
      } else {
        //a Profile does not exist
        errors.postdelete = "Profile does not exist";
        res.status(400).json(errors);
      }
    });
    //Profile Find Ends-------------------------
  }
); //  /api/profile/posts      http://localhost:5000/api/profile/posts
/* //========================
//DELETE  /posts ENDS
//========================  */

/* //========================
//DELETE  api/posts/comment/:id/:comment_id BEGINS 
//========================  */
//@router DELETE api/posts/comment/:id/:comment_id BEGINS
// @desc Delete Comment from Post
//@access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //does comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnonexist: "Comment does not exist" });
        }
        //Comment does exist:
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
); //  api/posts/comment/:id      http://localhost:5000/api/posts/comment/:id
/* //========================
//POST  api/posts/comment/:id ENDS
//========================  */

/* //========================================================================================================================
//DELETE ROUTES END 
//========================================================================================================================*/

module.exports = router;
