import Express from "express";
import { Request, Response } from "express";    
import jwt from "jsonwebtoken";
import { CurrentUser} from "@asadjan/common_test";
import { requireAuth } from "@asadjan/common_test";

const router = Express.Router();

router.get("/api/users/currentuser",
   CurrentUser,
   requireAuth,
  (req, res) => {
    console.log(req.currentUser);
        res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };