var express = require("express");
var router = express.Router();
var url = require("url");
var questionObj = require("../public/question");
var Question = questionObj.Question;
var qObj = new Question();
var answerObj = require("../public/answer");
var Answer = answerObj.Answer;
var aObj = new Answer();

router.get("/", function(req, res) {
  req.session.session_admin = false;
  res.render("home.html", function(err, renderedData) {
    res.send(renderedData);
  });
});

router.post("/", function(req, res) {
  setTimeout(destroySession, 12000, req);
  req.session.session_layout = "vertical";
  req.session.session_user = req.body.user;
  req.session.session_responses = aObj.findUserHistory(req.body.user);
  aObj.deletePreviousHistory(req.body.user);
  res.redirect("/question/0?");
});

function destroySession(req) {
  req.session.destroy();
  console.log("destroyed");
}
module.exports = router;
