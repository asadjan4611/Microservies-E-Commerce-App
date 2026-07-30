import express, { Request, Response } from "express";
import { Ticket } from "../model/ticket";
import { NotFoundError } from "@asadjan/common_test";

const router = express.Router();


router.get( "/api/tickets", async (req: Request, res: Response) => {
        const tickets = await Ticket.find({
            orderId: undefined
        });
        res.send(tickets);
    }
);


export { router as indexTicketRouter };