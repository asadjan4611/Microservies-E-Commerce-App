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

    const delay = Math.max(new Date(data.expiresAt).getTime() - Date.now(), 0);
    console.log("Waiting this many milliseconds to process the job:", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
        jobId: data.id,
      }
    );

    msg.ack();
  } 
}

export default OrderCreatedListener;
