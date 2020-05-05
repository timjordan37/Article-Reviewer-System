class Answer {
  constructor() {
    this.fs = require("fs");
    this.userSet = new Set(["Meg", "Sara", "Molly", "Kyle", "Jordan", "Brian"]);
    this.userArray;
    this.currentUser;
  }

  fsWrite(content) {
    var fd = this.fs.openSync(__dirname + "/answers.json", "w");
    this.fs.writeSync(fd, JSON.stringify(content), null, null);
    this.fs.closeSync(fd);
  }

  findUserHistory(user) {
    var obj = this.readInParseToJson();
    var history = [];
    for (var i = 0; i < obj.length; i++) {
      for (var j = 0; j < obj[i].answers.length; j++) {
        if (obj[i].answers[j].users.includes(user)) {
          var historyItem = {
            question_id: obj[i].question_id,
            response_id: obj[i].answers[j].response_id
          };
          history.push(historyItem);
        }
      }
    }
    return history;
  }

  deletePreviousHistory(user) {
    var obj = this.readInParseToJson();
    for (var i = 0; i < obj.length; i++) {
      for (var j = 0; j < obj[i].answers.length; j++) {
        var index = obj[i].answers[j].users.indexOf(user);
        if (index > -1) {
          obj[i].answers[j].users.splice(index, 1);
        }
      }
    }
    this.fsWrite(obj);
  }

  addUserAnswer(user, question_id, response_id) {
    var obj = this.readInParseToJson();
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].question_id === question_id) {
        for (var j = 0; j < obj[i].answers.length; j++) {
          if (obj[i].answers[j].response_id === response_id) {
            if (!obj[i].answers[j].users.includes(user)) {
              obj[i].answers[j].users.push(user);
              this.matchCount(this.userArray, obj[i].answers[j].users);
            }
          }
        }
      }
    }
    this.fsWrite(obj);
  }

  addUser(user) {
    this.userSet.add(user);
    this.userArray = this.createUserJsonArray();
    this.currentUser = user;
  }

  matchCount(userArray, responseArray) {
    for (var i = 0; i < userArray.length; i++) {
      if (responseArray.includes(userArray[i].name) && userArray[i].name) {
        userArray[i].count++;
      }
      if (userArray[i].name === this.currentUser) {
        userArray[i].count = "you";
      }
    }
  }
  createUserJsonArray() {
    var users = [];
    var it = this.userSet.entries();
    for (let user of it) {
      var obj = {
        name: user[0],
        count: 0
      };
      users.push(obj);
    }
    return users;
  }
  addAnswerObj(id, responseCount) {
    var newAnswer = {
      question_id: id,
      answers: []
    };
    for (var i = 0; i < responseCount; i++) {
      var newResponse = {
        response_id: i,
        users: []
      };
      newAnswer.answers.push(newResponse);
    }
    var obj = this.readInParseToJson();
    obj.push(newAnswer);
    this.fsWrite(obj);
  }
  readInParseToJson() {
    var fd = this.fs.openSync(__dirname + "/answers.json", "r");
    var questions = "";
    do {
      var buf = new Buffer.alloc(5);
      buf.fill();
      var bytes = this.fs.readSync(fd, buf, null, 5);
      questions += buf.toString();
    } while (bytes > 0);
    this.fs.closeSync(fd);
    questions = questions.replace(/[\u0000-\u0019]+/g, "");

    return JSON.parse(questions);
  }

  readInParseToJsonUsers() {
    var fd = this.fs.openSync(__dirname + "/users.json", "r");
    var users = "";
    do {
      var buf = new Buffer.alloc(5);
      buf.fill();
      var bytes = this.fs.readSync(fd, buf, null, 5);
      users += buf.toString();
    } while (bytes > 0);
    this.fs.closeSync(fd);
    users = users.replace(/[\u0000-\u0019]+/g, "");

    return JSON.parse(users);
  }
}

module.exports = {
  Answer: Answer
};
