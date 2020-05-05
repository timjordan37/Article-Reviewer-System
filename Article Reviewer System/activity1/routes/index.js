var express = require("express");
var app = require("../app");
var router = express.Router();
var commentObj = require("../public/comment");
var Comment = commentObj.Comment;
var comment = new Comment();
var url = require("url");
var fs = require('fs');
router.get("/", function(req, res) {
  var obj = comment.readInParseToJson();
  res.render("home.html", {
    comments: obj
  });
});

router.post("/add", function(req, res) {
  var newComment = {
    id: parseInt(req.body.id),
    text: req.body.text
  };
  var success = comment.addComment(newComment);
  if (success) {
    res.render("add.html", {});
    var activity = "add," + newComment.id + "," + newComment.text + "," + req.get("user-agent");
    comment.pushStack(activity);
  } else {
    res.render("invalidAdd.html", {});
  }
});

router.get("/add", function(req, res) {
  res.status(405);
  res.render("405.html", {});
});

router.post("/delete", function(req, res) {
  var success = comment.deleteComment(parseInt(req.body.id));
  if (success) {
    res.render("delete.html", {});
    var activity = "delete," + success.id + "," + success.text + "," + req.get("user-agent");
    comment.pushStack(activity);
  } else {
    res.render("invalidDelete.html", {});
  }
});

router.get("/delete", function(req, res) {
  res.status(405);
  res.render("405.html", {});
});

router.get("/view", function(req, res) {
  var obj = comment.stack;
  res.render("view.html", {
    activity: obj
  });
});

router.post("/undo", function(req, res) {
  var undo = comment.undoStack();
  if (undo) {
    undo = JSON.stringify(undo.act);
    undo = undo.split(",");
    operation = undo[0].replace('"', "");
    if (operation === "delete") {
      newComment = {
        id: parseInt(undo[1]),
        text: undo[2]
      };
      comment.addComment(newComment);
      console.log("here");
    } else if (operation === "add") {
      comment.deleteComment(parseInt(undo[1]));
    }
    var obj = comment.readInParseToJson();
    res.render("home.html", {
      comments: obj
    });
  } else {
    res.render("invalidUndo.html", {});
  }
});

router.get("/undo", function(req, res) {
  res.status(405);
  res.render("405.html", {});
});

router.get("/reset", function(req, res) {
  comment.resetStack();
  res.render("reset.html", {});
});

module.exports = router;
