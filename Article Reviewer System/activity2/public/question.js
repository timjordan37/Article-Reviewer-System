class Question {
  constructor() {
    this.fs = require("fs");
    this.questionCount = this.readInParseToJson().length;
  }
  findQuestionById(id) {
    var obj = this.readInParseToJson();
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].id === id) {
        return obj[i];
      }
    }
    return false;
  }

  fsWrite(content) {
    var fd = this.fs.openSync(__dirname + "/questions.json", "w");
    this.fs.writeSync(fd, JSON.stringify(content), null, null);
    this.fs.closeSync(fd);
  }

  addQuestion(question, responses) {
    var responseArr = responses.split(",");
    var newQuestion = {
      id: this.questionCount,
      question: question,
      responses: []
    };
    for (var i = 0; i < responseArr.length; i++) {
      var newResponse = {
        response_id: i,
        text: responseArr[i]
      };
      newQuestion.responses.push(newResponse);
    }
    this.questionCount++;
    var obj = this.readInParseToJson();
    obj.push(newQuestion);
    this.fsWrite(obj);
  }
  readInParseToJson() {
    var fd = this.fs.openSync(__dirname + "/questions.json", "r");
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
}
module.exports = {
  Question: Question
};
