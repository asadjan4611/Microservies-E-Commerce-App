    import {Message} from "node-nats-streaming";
import  TicketCreatedEvent from "@asadjan/common_test/build/event/ticket-created-event";
import Listener from "@asadjan/common_test/build/event/base-listener";
import {Ticket} from "../../model/ticket";
import {Subject} from "@asadjan/common_test";
import {queueGroupName} from "./queue-group-name";



class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subject.TicketCreated=Subject.TicketCreated;
    queueGroupName=queueGroupName;


    async onMessage(data:TicketCreatedEvent["data"],msg:Message){
        const {id,title,price}=data;
        const ticket=Ticket.build({
            id,
            title,
            price   
        });
        await ticket.save();
        msg.ack();
    }
}   

export default TicketCreatedListener;