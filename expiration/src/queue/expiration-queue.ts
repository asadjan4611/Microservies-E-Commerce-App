import Queue from "bull";
import ExpirationCompletePublisher from "../event/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const redisHost = process.env.REDIS_HOST;

if (!redisHost) {
  throw new Error("REDIS_HOST must be defined");
}

const expirationQueue = new Queue<Payload>("expiration-queue", {
  redis: {
    host: redisHost,
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

expirationQueue.process(async (job) => {

  new ExpirationCompletePublisher(natsWrapper.client).listen({
    orderId: job.data.orderId,
  });
  console.log("Processing job:", job.id, "with data:", job.data);
});

export default expirationQueue;