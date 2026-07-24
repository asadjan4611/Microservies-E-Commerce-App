import express from "express";
import "express-async-errors";
import json from "body-parser";
import CookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@asadjan/common_test";
import { NotFoundError } from "@asadjan/common_test";
import { signinRouter } from "./routes/sigin";
import { signoutRouter } from "./routes/signout";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  CookieSession({
    signed: false,
    // secure:true,
  })
);

app.use(signoutRouter);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);


app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);


export { app };