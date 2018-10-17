"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../modules/user.js");
const middlewares = require("../middlewares/middlewares");
const mongoose = require("mongoose");

router.get("/profile", (req, res, next) => {
  res.render("auth/profile");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", middlewares.requireUser, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.redirect("/auth/signup");
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({ username, password: hashedPassword });
      newUser
        .save()
        .then(item => {
          res.redirect("/auth/profile");
        })
        .catch(next);
    })
    .catch(next);
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});
router.post("/login", middlewares.requireUser, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (!user) {
      return res.redirect("/auth/login");
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/auth/profile");
    } else {
      res.redirect("/auth/login");
    }
  });
});

router.get("/private", middlewares.userLoggedIn, (req, res, next) => {
  res.render("auth/private");
});

router.get("/main", (req, res, next) => {
  res.render("auth/main");
});

module.exports = router;
