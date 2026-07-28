import  OrderCreatedEvent  from "@asadjan/common_test/build/event/order-create-event";

import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";
import OrderCreatedListener from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderStatus } from "@asadjan/common_test";
import { expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "../../../app";
import {jest} from "@jest/globals";

const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'alskdjflasjdf'
    });
    await ticket.save();

    //create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'alskdjflasjdf',
        expiresAt: 'alskdjflasjdf',
        ticket: {
            id: ticket._id.toHexString(),
            price: ticket.price
        }
    };

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};


it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket._id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
    


it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] as string
    );
// 
    expect(data.id).toEqual(ticketUpdatedData.orderId); 
});