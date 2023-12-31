const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const indexRouter = require('./routes/index');
const homeRouter = require('./routes/homeRoute');
const athletesRouter = require('./routes/athletesRoute');
const sportsRouter = require('./routes/sportsRoute');
const staffRouter = require('./routes/staffRoute');

const app = express();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/athletes', athletesRouter);
app.use('/sports', sportsRouter);
app.use('/staff', staffRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
