const express = require("express");
const subscriptionRouter = require("./contoller/subscription");
const userRouter = require("./contoller/user");
const app = express();
const port = process.env.PORT || 3000;
const { errorHandler, logErrors } = require("./middlewares/errorHandler");

app.use(express.json());

// User APIs
app.use("/user", userRouter);

// Subscription APIs
app.use("/subscription", subscriptionRouter);

// Error Logs
app.use(logErrors);

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
