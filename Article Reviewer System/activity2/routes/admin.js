var express = require("express");
var router = express.Router();
var questionObj = require("../public/question");
var Question = questionObj.Question;
var qObj = new Question();
var answerObj = require("../public/answer");
var Answer = answerObj.Answer;
var aObj = new Answer();

router.get("/login", function(req, res) {
  res.render("login.html");
});

router.post("/admin", function(req, res) {
  if (req.body.username === req.body.password) {
    req.session.session_admin = req.body.username;
    var questionList = qObj.readInParseToJson();
    res.render("adminView.html", {
      questions: questionList
    });
  } else {
    res.redirect(401, "/login?");
  }
});

router.get("/admin", function(req, res) {
  if (!req.session.session_admin) {
    res.redirect(401, "/login?");
  } else {
    var questionList = qObj.readInParseToJson();
    res.render("adminView.html", {
      questions: questionList
    });
  }
});

router.get("/create", function(req, res) {
  if (!req.session.session_admin) {
    res.redirect(401, "/login?");
  } else {
    res.render("create.html");
  }
});

router.post("/create", function(req, res) {
  var questionId = qObj.readInParseToJson().length;
  var responseCount = req.body.responses.split(",").length;
  qObj.addQuestion(req.body.question, req.body.responses);
  aObj.addAnswerObj(questionId, responseCount);
  res.redirect("/admin?");
});

module.exports = router;
