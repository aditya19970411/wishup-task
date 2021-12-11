const express = require("express");
const { getUser, createUser, deleteUser } = require("../services/userService");
const userRouter = express.Router();

// retrieve a user
userRouter.get("/:username", async function (req, res, next) {
  getUser(req.params.username)
    .then(function (user) {
      res.status(200).json({ ...user });
    })
    .catch(function (err) {
      next(err);
    });
});

// create | update a user
userRouter.put("/:username", async function (req, res, next) {
  createUser(req.params.username)
    .then(function (user) {
      res.status(200).json({ ...user });
    })
    .catch(function (err) {
      next(err);
    });
});

// delete a user
userRouter.delete("/:username", function (req, res, next) {
  deleteUser(req.params.username)
    .then(function (del) {
      res.status(200).json({ ...del });
    })
    .catch(function (err) {
      next(err);
    });
});

// create a user
userRouter.post("/:username", function (req, res, next) {
  createUser(req.params.username)
    .then(function (user) {
      res.status(200).json({ ...user });
    })
    .catch(function (err) {
      next(err);
    });
});

module.exports = userRouter;
