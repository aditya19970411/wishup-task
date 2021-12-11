function errorHandler(err, req, res) {
  console.log("ERROR HANDLER", ...err);
  res.json({
    // error: {
    //   code: err.code,
    //   message: err.message,
    //   name: err.name,
    // },
    name: "SOME",
  });
}

module.exports = { errorHandler };
