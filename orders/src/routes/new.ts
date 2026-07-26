import express, { Request, Response } from "express";
const router = express.Router();
import { body } from "express-validator";
import {
    NotFoundError,
    requireAuth,
    validateRequest,
    BadRequestError
} from "@asadjan/common_test";
import mongoose from "mongoose";
import { OrderStatus } from "@asadjan/common_test";
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";



 const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
    "/api/orders",
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("Ticket ID is required"),
    ],
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        //make sure that this ticket is not already reserved

        const isreserved = await ticket.isReserved();
        if (isreserved) {
            throw new BadRequestError("Ticket is already reserved");
        }


        //calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);         
        //build the order and save it to the database



         const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
        });
        await order.save();

        //publish an event saying that an order was created
         

        res.status(201).send(order); 
    });

export { router as newOrderRouter };