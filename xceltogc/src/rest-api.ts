const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const log4js = require('./lib/logger');
const config = require('./config/config');

const getRouter = require('./routes/get');
const postRouter = require('./routes/post');
/* EDF ENR */
const EdfRouter = require('./routes/edf_router');

const app = express();
const logger = log4js.getLogger();

app.use(log4js.connectLogger(logger, {level: 'DEBUG'}));

app.use(fileUpload({
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB
  },
  uploadTimeout: 0,
  createParentPath: true,
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: config.server.uploadTempPath
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'resources')));

app.use('/', getRouter);
app.use('/', postRouter);
app.use('/edf', EdfRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  let error_info = {
    error: "Internal server error(error handler)",
    error_code: err.status || 500,
    error_msg: err.message,
  };

  logger.fatal(error_info);
  res.json(error_info);
});

module.exports = app;
