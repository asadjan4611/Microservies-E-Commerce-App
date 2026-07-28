import Listener from "@asadjan/common_test/build/event/base-listener";
import OrderCreatedEvent from "@asadjan/common_test/build/event/order-create-event";
import { queueGroupName } from "../queue-group-name";
import { Ticket } from "../../model/ticket";
import { Subject } from "@asadjan/common_test";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";
// import { natsWrapper } from "../../nats-wrapper";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: any) {


        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        //mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });
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

export default OrderCreatedListener;


