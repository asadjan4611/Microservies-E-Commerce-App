import Express from "express";
import { Request, Response } from "express";    
import { CurrentUser} from "@asadjan/common_test";

const router = Express.Router();

router.get("/api/users/currentuser",
   CurrentUser,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
