import express from "express";
import "express-async-errors";
import json from "body-parser";
import CookieSession from "cookie-session";
import { CurrentUser, errorHandler } from "@asadjan/common_test";
import { NotFoundError } from "@asadjan/common_test";
import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  CookieSession({
    signed: false,
    // secure:true,
  })
);

app.use(CurrentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);


app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);


export { app };