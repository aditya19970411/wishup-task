const express = require("express");
const userRouter = require("./contoller/user");
const app = express();
const port = process.env.PORT || 3000;
const { errorHandler } = require("./middlewares/errorHandler");

app.use(express.json());

app.use("/user", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
