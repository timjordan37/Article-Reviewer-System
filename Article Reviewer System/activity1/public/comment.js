class Comment {
  constructor() {
    this.fs = require("fs");
    this.stack = [];
  }

  addComment(obj) {
    if (this.findComment(obj.id)) {
      return false;
    }
    var comments = this.readInParseToJson();
    comments.push(obj);
    this.fsWrite(comments);
    return true;
  }

  deleteComment(id) {
    var obj = this.readInParseToJson();
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].id === id) {
        var deleted = obj[i];
        obj.splice(i, i + 1);
        this.fsWrite(obj);
        return deleted;
      }
    }
    return false;
  }

  findComment(id) {
    var obj = this.readInParseToJson();
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].id == id) {
        return true;
      }
    }
    return false;
  }

  pushStack(operation) {
    var activity = {
      act: operation
    };
    this.stack.push(activity);
  }

  printStack() {
    console.log(this.stack);
  }

  resetStack() {
    this.stack = [];
    var emptyComments = [];
    this.fsWrite(emptyComments);
  }

  undoStack() {
    var obj = this.stack.pop();
    if (obj) {
      return obj;
    }
    return false;
  }

  fsWrite(content) {
    var fd = this.fs.openSync(__dirname + "/comment.json", "w");
    this.fs.writeSync(fd, JSON.stringify(content), null, null);
    this.fs.closeSync(fd);
  }

  readInParseToJson() {
    var fd = this.fs.openSync(__dirname + "/comment.json", "r");
    var comments = "";
    do {
      var buf = new Buffer.alloc(5);
      buf.fill();
      var bytes = this.fs.readSync(fd, buf, null, 5);
      comments += buf.toString();
    } while (bytes > 0);
    this.fs.closeSync(fd);
    comments = comments.replace(/[\u0000-\u0019]+/g, "");
    return JSON.parse(comments);
  }
}
module.exports = {
  Comment: Comment
};
