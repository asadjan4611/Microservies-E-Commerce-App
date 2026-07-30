import { queueGroupName } from "./queue-group-name";
import Listener from "@asadjan/common_test/build/event/base-listener";
import { Subject } from "@asadjan/common_test";
import OrderCreatedEvent from "@asadjan/common_test/build/event/order-create-event";
import {Order} from "../../model/order";


class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: any) {
         const order = await Order.build({
            id: data.id.toString(),
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
         });
         await order.save();

        // console.log("OrderCreatedListener data", data);
        console.log("OrderCreatedListener order", order);
        msg.ack();
    }
}

export default OrderCreatedListener;    