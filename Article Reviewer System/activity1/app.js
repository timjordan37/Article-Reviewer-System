var express = require("express");
var createError = require("http-errors");
var path = require("path");
ejs = require("ejs");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.engine("html", ejs.renderFile);
ejs = require("ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.disable("etag");
var indexRouter = require("./routes/index");
app.use("/", indexRouter);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render(path.join(__dirname, "views/error.html"), {});
});
module.exports = app;
