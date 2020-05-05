var express = require("express");
var router = express.Router();
var questionObj = require("../public/question");
var Question = questionObj.Question;
var qObj = new Question();
var answerObj = require("../public/answer");
var Answer = answerObj.Answer;
var aObj = new Answer();

router.post("/question/:id", function(req, res) {
  var historyItem = findHistory(req.session.session_responses, parseInt(req.params.id));
  if (!req.session.session_user) {
    res.redirect(401, "/");
  } else if (historyItem) {
    var newHistory = {
      question_id: parseInt(req.params.id) - 1,
      response_id: parseInt(req.body.response_id)
    };
    insertHistory(req, newHistory, req.session.session_responses);
    var question = qObj.findQuestionById(historyItem.question_id);
    res.render("question.html", {
      question: question.question,
      number: question.id,
      previous: historyItem.response_id,
      responses: question.responses,
      nextQuestion: question.id + 1,
      prevQuestion: question.id - 1,
      layout: req.session.session_layout
    });
  } else if (parseInt(req.params.id) === qObj.readInParseToJson().length) {
    var newHistory = {
      question_id: parseInt(req.params.id) - 1,
      response_id: parseInt(req.body.response_id)
    };
    insertHistory(req, newHistory, req.session.session_responses);
    res.render("submit.html", {
      prevQuestion: parseInt(req.params.id) - 1
    });
  } else {
    var newHistory = {
      question_id: parseInt(req.params.id) - 1,
      response_id: parseInt(req.body.response_id)
    };
    insertHistory(req, newHistory, req.session.session_responses);
    var question = qObj.findQuestionById(parseInt(req.params.id));
    res.render("question.html", {
      question: question.question,
      number: question.id,
      previous: "",
      responses: question.responses,
      nextQuestion: question.id + 1,
      prevQuestion: question.id - 1,
      layout: req.session.session_layout
    });
  }
});

router.get("/question/:id", function(req, res) {
  var historyItem = findHistory(req.session.session_responses, parseInt(req.params.id));
  if (!req.session.session_user) {
    res.redirect(401, "/");
  } else if (parseInt(req.params.id) < 0) {
    res.redirect("/question/0");
  } else if (historyItem) {
    var question = qObj.findQuestionById(historyItem.question_id);
    res.render("question.html", {
      question: question.question,
      number: question.id,
      previous: historyItem.response_id,
      responses: question.responses,
      nextQuestion: question.id + 1,
      prevQuestion: question.id - 1,
      layout: req.session.session_layout
    });
  } else {
    var question = qObj.findQuestionById(parseInt(req.params.id));
    res.render("question.html", {
      question: question.question,
      number: question.id,
      previous: "",
      responses: question.responses,
      nextQuestion: question.id + 1,
      prevQuestion: question.id - 1,
      layout: req.session.session_layout
    });
  }
});

router.post("/results", function(req, res) {
  if (!req.session.session_user) {
    res.redirect(401, "/");
  } else {
    aObj.addUser(req.session.session_user);
    for (var i = 0; i < req.session.session_responses.length; i++) {
      aObj.addUserAnswer(
        req.session.session_user,
        parseInt(req.session.session_responses[i].question_id),
        parseInt(req.session.session_responses[i].response_id)
      );
    }
    res.render("result.html", {
      matches: aObj.userArray
    });
  }
});

router.get("/render/:id", function(req, res) {
  if (!req.session.session_user) {
    res.redirect(401, "/");
  } else {
    res.render("render.html", {
      id: req.params.id
    });
  }
});

router.post("/render/:id", function(req, res) {
  req.session.session_layout = req.body.layout;
  res.redirect("/question/" + req.params.id);
});

function findHistory(history, id) {
  if (!history || history.length === 0) {
    return false;
  }
  for (var i = 0; i < history.length; i++) {
    if (history[i].question_id === id) {
      return history[i];
    }
  }
  return false;
}

function insertHistory(req, historyItem, history) {
  if (!history) {
    req.session.session_responses = [];
    req.session.session_responses.push(historyItem);
    return;
  }
  var found = false;
  for (var i = 0; i < history.length; i++) {
    if (history[i].question_id === historyItem.question_id) {
      history[i].response_id = historyItem.response_id;
      found = true;
      return true;
    }
  }
  if (!found) {
    req.session.session_responses.push(historyItem);
  }
  return false;
}

module.exports = router;
