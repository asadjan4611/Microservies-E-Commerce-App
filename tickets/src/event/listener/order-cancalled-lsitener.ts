import Listener from "@asadjan/common_test/build/event/base-listener";
import OrderCancelledEvent from "@asadjan/common_test/build/event/order-cancel-event";
import { queueGroupName } from "../queue-group-name";
import { Ticket } from "../../model/ticket";
import { Subject } from "@asadjan/common_test";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";
// import { natsWrapper } from "../../nats-wrapper";


 class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: any) {
        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket, throw error
        if (!ticket) {          
    throw new Error('Ticket not found');        
        }
         

        //mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: undefined });
        //save the ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).listen({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
        console.log('Event data!', data);
        msg.ack();
    }
}

export default OrderCancelledListener;