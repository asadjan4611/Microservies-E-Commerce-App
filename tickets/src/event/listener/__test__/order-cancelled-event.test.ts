 import  OrderCancelledListener  from "../order-cancalled-lsitener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";
import  OrderCancelledEvent  from "@asadjan/common_test/build/event/order-cancel-event";
import { expect, it } from "@jest/globals";
import {jest} from "@jest/globals";
import mongoose from "mongoose";

const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'alskdjflasjdf'
    });
    await ticket.save();

    //create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket._id.toHexString(),
        }
    };

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};  

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket._id);
    
    expect(updatedTicket!.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.listeners).toHaveBeenCalled();
}   
);
