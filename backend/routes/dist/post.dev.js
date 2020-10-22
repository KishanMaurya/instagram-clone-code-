"use strict";

var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var requiredLogin = require('../middleware/requiredLogin');

var Post = mongoose.model("Post");
router.get('/allpost', function (req, res) {
  Post.find().populate("postedBy", "_id name").then(function (posts) {
    res.send(posts);
  })["catch"](function (err) {
    console.log(err);
  });
});
router.post('/createpost', requiredLogin, function (req, res) {
  var _req$body = req.body,
      title = _req$body.title,
      body = _req$body.body,
      pic = _req$body.pic;

  if (!title || !body || !pic) {
    return res.status(422).json({
      error: "Plase add all the fields"
    });
  }

  req.user.password = undefined;
  var post = new Post({
    title: title,
    body: body,
    photo: pic,
    postedBy: req.user
  });
  post.save().then(function (result) {
    res.json({
      post: result
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
router.get('/mypost', requiredLogin, function (req, res) {
  Post.find({
    postedBy: req.user._id
  }).populate("postedBy", "_id name").then(function (mypost) {
    res.json({
      mypost: mypost
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
module.exports = router;