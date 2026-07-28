import mongoose from "mongoose";
import {it,expect} from "@jest/globals";
import {Message} from "node-nats-streaming";
import {jest} from "@jest/globals";
import request from "supertest";
import {app} from "../../../app";
import { natsWrapper } from "../../../nats-wrapper";
import {Ticket} from "../../../model/ticket";
import  TicketCreatedEvent from "@asadjan/common_test/build/event/ticket-created-event";
import TicketCreatedListener from "../ticket-created-listener";


const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create a fake data event
    const data: TicketCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "concert",
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    } as unknown as Message;

    return { Listener: listener, data, msg };
};

it("create and save a ticket",async()=>{

    const {Listener,data,msg}=await setup();
    //call the onMessage function with the data object + message object
    await Listener.onMessage(data,msg);
    //write assertions to make sure a ticket was created
    const ticket=await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    
});
it("acks the message",async()=>{

    const {Listener,data,msg}=await setup();
    //call the onMessage function with the data object + message object
    await Listener.onMessage(data,msg);
    //write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
    
});

it("does not call ack if the event has a skipped version number",async()=>{

    const {Listener,data,msg}=await setup();
    data.version=10;
    //call the onMessage function with the data object + message object
    try{            
        await Listener.onMessage(data,msg);
    }catch(err){
        // console.log(err);
    }
    //write assertions to make sure ack function is called
    expect(msg.ack).not.toHaveBeenCalled();
    
});
