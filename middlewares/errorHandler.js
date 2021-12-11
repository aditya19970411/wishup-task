function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500);
  res.json({ message: err.message, error: err });
}

function logErrors(err, req, res, next) {
  console.log("ERROR:", err);
  next(err);
}

module.exports = { errorHandler, logErrors };
