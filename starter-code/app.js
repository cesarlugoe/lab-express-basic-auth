'use strict';
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const createError = require('http-errors');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const celebritiesRouter = require('./routes/celebrities');
const moviesRouter = require('./routes/movies');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost/celebritiesApp',{
  useNewUrlParser: true,
});

// view engine setup
app.use(morgan('dev'));
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Manejo de cookies y sesion 

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// Routers
app.use('/', indexRouter);
app.use('/movies', moviesRouter);
app.use('/celebrities', celebritiesRouter)
app.use('/auth', authRouter);

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
  res.render('error');
});


module.exports = app;