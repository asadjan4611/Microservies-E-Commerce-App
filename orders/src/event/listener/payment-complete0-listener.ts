import { Message } from "node-nats-streaming";
import Listener from "@asadjan/common_test/build/event/base-listener";
import { Order } from "../../model/order";
import { Subject } from "@asadjan/common_test";
import { queueGroupName } from "./queue-group-name";
import { OrderStatus } from "@asadjan/common_test/build";
import PaymentCreatedEvent from "@asadjan/common_test/build/event/payment-created-event";

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
        console.log("PaymentCreatedListener data", data);

        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }           
}



export default PaymentCreatedListener;

