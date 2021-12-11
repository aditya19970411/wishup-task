const fs = require("fs");
const moment = require("moment");

const usersData = JSON.parse(fs.readFileSync(__dirname + "/data/users.json"));
const subscriptionsData = JSON.parse(
  fs.readFileSync(__dirname + "/data/subscriptions.json")
);
const plansData = JSON.parse(fs.readFileSync(__dirname + "/data/plans.json"));

// Calculate Valid Till function
function validTill(start_date, validity) {
  return moment(start_date).add(Number(validity), "d").format("YYYY-MM-DD");
}

function createSubscriptions({ user_name, plan_id, start_date }) {
  const user = usersData.users.find((user) => user.user_name === user_name);
  const plan = plansData.plans.find((plan) => plan.plan_id === plan_id);
  const preExistsPlans = subscriptionsData.subscriptions.filter(
    (sub) =>
      (sub.plan_id === "FREE" && sub.user_name === user_name) ||
      (sub.plan_id === plan_id &&
        sub.user_name === user_name &&
        moment(start_date).isBetween(
          sub.start_date,
          validTill(sub.start_date, plan.validity) ||
            moment(start_date).isSame(sub.start_date) ||
            moment(start_date).isSame(validTill(sub.start_date, plan.validity))
        ))
  );
  console.log(preExistsPlans);
  return new Promise(function (resolve, reject) {
    if (!user || !user_name)
      reject({
        message: "Provided user_name is incorrect",
        statusCode: 400,
        name: "BADREQUEST",
        staus: "FAILURE",
        amount: 0.0,
      });
    else if (!plan || !plan_id)
      reject({
        message: "Provided plan_id is incorrect",
        statusCode: 400,
        name: "BADREQUEST",
        staus: "FAILURE",
        amount: 0.0,
      });
    else if (!start_date)
      reject({
        message: "Provided start_date is incorrect",
        statusCode: 400,
        name: "BADREQUEST",
        staus: "FAILURE",
        amount: 0.0,
      });
    else if (!preExistsPlans !== 0) {
      reject({
        message: "Plan which contains start date in between already exists",
        statusCode: 303,
        name: "ALREADYEXISTSERROR",
        staus: "FAILURE",
        amount: 0.0,
      });
    } else {
      const newSubsObj = {
        user_name: user.user_name,
        plan_id: plan.plan_id,
        start_date: moment().format("YYYY-MM-DD"),
      };
      const newSubsData = { ...subscriptionsData };
      newSubsData.subscriptions.push(newSubsObj);
      fs.writeFile(
        __dirname + "/data/subscriptions.json",
        JSON.stringify(newSubsData),
        function (err) {
          console.log("ERROR", err);
          if (err) {
            reject({
              message: "Internal error occured",
              statusCode: 500,
              name: "INTERNALEROR",
              staus: "FAILURE",
              amount: 0.0,
            });
          } else resolve({ status: "SUCCESS", amount: plan.cost * -1 });
        }
      );
    }
  });
}

function getSubscription({ user_name, date }) {
  const user = usersData.users.find((user) => user.user_name === user_name);
  return new Promise(function (resolve, reject) {
    if (!user)
      reject({
        message: "User not found",
        statusCode: 404,
        name: "USERNOTFOUNDERROR",
      });
    else if (!date) {
      const allSubs = subscriptionsData.subscriptions.filter(
        (plan) => plan.user_name === user_name
      );
      const subs = [];
      allSubs.forEach((sub) => {
        var plan = plansData.plans.find((plan) => plan.plan_id === sub.plan_id);
        if (plan.plan_id === "FREE") {
          subs.push({
            plan_id: plan.plan_id,
            start_date: sub.start_date,
            valid_till: plan.validity,
          });
        } else {
          var valid_till = validTill(sub.start_date, plan.validity);
          subs.push({
            plan_id: plan.plan_id,
            start_date: sub.start_date,
            valid_till: valid_till,
          });
        }
      });
      resolve(subs);
    } else {
      if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        reject({
          message: "Incorrect date format",
          statusCode: 404,
          name: "BADDATEERROR",
        });
      } else {
        const allSubs = subscriptionsData.subscriptions.filter(
          (plan) => plan.user_name === user_name
        );
        const validSubs = [];
        allSubs.forEach((sub) => {
          var plan = plansData.plans.find(
            (plan) => plan.plan_id === sub.plan_id
          );
          if (plan.plan_id === "FREE") {
            validSubs.push({
              plan_id: plan.plan_id,
              days_left: plan.validity,
            });
          } else {
            var valid_till = validTill(sub.start_date, plan.validity);
            const days_left = moment(valid_till).diff(date, "days");
            if (days_left >= 0) {
              validSubs.push({
                plan_id: plan.plan_id,
                days_left,
              });
            }
          }
        });
        resolve(validSubs);
      }
    }
  });
}

module.exports = {
  createSubscriptions,
  getSubscription,
};
