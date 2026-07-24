import express,{Request,Response} from "express";
const  router = express.Router();
import { body } from "express-validator";
import {requireAuth,validateRequest} from "@asadjan/common_test";
import mongoose from "mongoose";


router.post(
    "/api/orders",
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("Ticket ID is required"),
    ],
    requireAuth,
    validateRequest,
    (req:Request,res:Response)=>{
    res.send("Hello from orders service");
});

export {router as newOrderRouter};