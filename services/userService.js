const fs = require("fs");
const moment = require("moment");
const data = JSON.parse(fs.readFileSync(__dirname + "/data/users.json"));

function createUser(username) {
  var created_at = moment().format("YYYY-MM-DD HH:mm:ss");
  const userObject = {
    user_name: username,
    created_at,
  };
  return new Promise(function (resolve, reject) {
    const userExists = data.users.find((user) => user.user_name === username);
    if (userExists)
      reject({
        message: "User already exists",
        code: 403,
        name: "USERALREADYEXISTSERROR",
      });
    else {
      var updateData = { ...data };
      updateData.users.push(userObject);
      fs.writeFile(
        __dirname + "/data/users.json",
        JSON.stringify(updateData),
        function (err) {
          if (err) {
            reject({
              message: "Internal error occured",
              code: 500,
              name: "INTERNALEROR",
            });
          } else resolve(userObject);
        }
      );
    }
  });
}

function getUser(username) {
  return new Promise(function (resolve, reject) {
    var user = data.users.find((user) => user.user_name === username);
    if (!user) {
      reject({
        message: "User not Found",
        code: 404,
        name: "USERNOTFOUNDERROR",
      });
    } else resolve(user);
  });
}

function deleteUser(username) {
  return new Promise(function (resolve, reject) {
    var user = data.users.find((user) => user.user_name === username);
    if (!user) {
      reject({
        message: "User not Found",
        code: 404,
        name: "USERNOTFOUNDERROR",
      });
    } else {
      const newData = data.users.filter((user) => user.user_name !== username);
      fs.writeFile(
        __dirname + "/data/users.json",
        JSON.stringify({ users: newData }),
        function (err) {
          if (err) {
            reject({
              message: "Internal error occured",
              code: 500,
              name: "INTERNALEROR",
            });
          } else resolve({ message: "User deleted Succesfully" });
        }
      );
    }
  });
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
};
