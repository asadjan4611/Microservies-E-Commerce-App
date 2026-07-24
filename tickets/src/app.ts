import express from "express";
import "express-async-errors";
import json from "body-parser";
import CookieSession from "cookie-session";
import { CurrentUser, errorHandler } from "@asadjan/common_test";
import { NotFoundError } from "@asadjan/common_test";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import {updateTicketRouter} from "./routes/update";


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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);


export { app };