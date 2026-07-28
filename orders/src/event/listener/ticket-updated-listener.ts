import {Message} from "node-nats-streaming";
import Listener from "@asadjan/common_test/build/event/base-listener";
import {Ticket} from "../../model/ticket";
import {Subject} from "@asadjan/common_test";
import {queueGroupName} from "./queue-group-name";
import TicketUpdatedEvent from "@asadjan/common_test/build/event/ticket-updated-event";



class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subject.TicketUpdated=Subject.TicketUpdated;
    queueGroupName=queueGroupName;


    async onMessage(data:TicketUpdatedEvent["data"],msg:Message){
        
        const ticket=await Ticket.findByEvent(data);

        if(!ticket){
            throw new Error("Ticket not found");
        }
        const {title,price}=data;
        ticket.set({title,price});
        await ticket.save();
        msg.ack();
    }
}   

export default TicketUpdatedListener;