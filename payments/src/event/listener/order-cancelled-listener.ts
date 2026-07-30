import { queueGroupName } from "./queue-group-name";
import Listener from "@asadjan/common_test/build/event/base-listener";
import { Subject } from "@asadjan/common_test";
import {Order} from "../../model/order";
import { OrderStatus } from "@asadjan/common_test";
import OrderCancelledEvent from "@asadjan/common_test/build/event/order-cancel-event";


class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: any) {
          
        const   order = await Order.findOne({
            id: data.id,
            version: data.version - 1
        });

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();


        msg.ack();
    }
}

export default OrderCancelledListener;    