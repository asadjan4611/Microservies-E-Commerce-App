import express,{Request,Response} from "express";
import { Ticket } from "../model/ticket";
import {validateRequest, NotFoundError,NotAuthorizedError,requireAuth, BadRequestError } from "@asadjan/common_test";   
import {body} from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import TicketUpdatedPublisher from "../event/publishers/ticket-updated-publisher";

const router = express.Router();

router.put('/api/tickets/:id',
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
    ],
    validateRequest,

    requireAuth, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }


    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
        throw new BadRequestError("Cannot edit a reserved ticket");
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();

   await new TicketUpdatedPublisher(natsWrapper.client).listen({
        id: ticket._id.toString(),
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.send(ticket);


});
export { router as updateTicketRouter };