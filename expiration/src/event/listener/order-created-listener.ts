import Listener from "@asadjan/common_test/build/event/base-listener";
import  OrderCreatedEvent  from "@asadjan/common_test/build/event/order-create-event";
import { queueGroupName } from "./queue-group-name";
import {Subject} from "@asadjan/common_test/build/event/subject";
import { Message } from "node-nats-streaming";
import expirationQueue from "../../queue/expiration-queue";



class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subject.OrderCreated = Subject.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);
    await expirationQueue.add({
      orderId: data.id,
    }, {
      delay: 1000 * 60 * 1, // 1 minute
    });

    msg.ack();
  } 
}

export default OrderCreatedListener;