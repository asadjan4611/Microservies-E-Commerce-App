import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@asadjan/common_test";
import { Order } from "../model/order";
import { Ticket } from "../model/ticket";
const router = express.Router();

router.get(
    "/api/orders",
    requireAuth
    , async (req: Request, res: Response) => {

        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket');

        res.send(orders);
    });

export { router as indexOrderRouter };