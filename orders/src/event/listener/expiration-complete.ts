import { Message } from "node-nats-streaming";
import ExpirationCompleteEvent from "@asadjan/common_test/build/event/expiration-complete-event";
import Listener from "@asadjan/common_test/build/event/base-listener";
import { Order } from "../../model/order";
import { Subject } from "@asadjan/common_test";
import { queueGroupName } from "./queue-group-name";
import OrderCancelledEvent from "../publisher/order-cancelled-publisher";
import { OrderStatus } from "@asadjan/common_test/build";


class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message): Promise<void> {
        console.log("ExpirationCompleteListener data", data);

        const order =  await Order.findById(data.orderId).populate("ticket");
        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledEvent(this.client).listen({
            id: order._id.toString(),
            version: order.version,
            ticket: {
                id: order.ticket._id.toString(),
            },
        });

        msg.ack();

    }
}


export default ExpirationCompleteListener;