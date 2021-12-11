const express = require("express");
const {
  createSubscriptions,
  getSubscription,
} = require("../services/subscriptionService");
const subscriptionRouter = express();

// Create subscription
subscriptionRouter.post("/", function (req, res, next) {
  createSubscriptions({
    user_name: req.body.user_name,
    plan_id: req.body.plan_id,
    start_date: req.body.start_date,
  })
    .then(function (subs) {
      res.json({ ...subs });
    })
    .catch(function (err) {
      next(err);
    });
});

// Get subscription with date
subscriptionRouter.get("/:username/:date", function (req, res, next) {
  getSubscription({
    user_name: req.params.username,
    date: req.params.date,
  })
    .then(function (subs) {
      res.json(subs);
    })
    .catch(function (err) {
      next(err);
    });
});

// Get subscription without date
subscriptionRouter.get("/:username", function (req, res, next) {
  getSubscription({
    user_name: req.params.username,
    date: req.params.date,
  })
    .then(function (subs) {
      res.json(subs);
    })
    .catch(function (err) {
      next(err);
    });
});

module.exports = subscriptionRouter;
