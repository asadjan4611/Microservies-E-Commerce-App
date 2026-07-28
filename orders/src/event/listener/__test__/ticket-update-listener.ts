import  TicketUpdateListener  from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";
import TicketUpdatedEvent from "@asadjan/common_test/build/event/ticket-updated-event";
import { Ticket } from "../../../model/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import {jest} from "@jest/globals";
import {it,expect} from "@jest/globals";



const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdateListener(natsWrapper.client);      

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();
    // create a fake data event
    const data: TicketUpdatedEvent["data"] = {
        id: ticket._id.toHexString(),
        version: ticket.version + 1,
        title: "new concert",
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    } as unknown as Message;

    return { Listener: listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
    const { Listener, data, msg, ticket } = await setup();
    //call the onMessage function with the data object + message object
    await Listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket._id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
    const { Listener, data, msg } = await setup();
    //call the onMessage function with the data object + message object
    await Listener.onMessage(data, msg);
    //write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
    const { Listener, data, msg } = await setup();
    data.version = 10;
    try {
        await Listener.onMessage(data, msg);
    } catch (err)  
{}
    expect(msg.ack).not.toHaveBeenCalled();
}); 