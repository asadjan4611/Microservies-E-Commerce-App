import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
// import TicketCreatedListener from "./event/listener/ticket-created-listener";
import TicketUpdatedListener from "./event/listener/ticket-updated-listener";
import TicketCreatedListener from "./event/listener/ticket-created-listener";
const start = async () => {

  // console.log("Starting up....", natsWrapper);
  if (process.env.JWT_KEY === undefined) {
    throw new Error("JWT_KEY must be defined");
  }

  if (process.env.MONGO_URI === undefined) {
    throw new Error("MONGO_URI must be defined");
  }

  if (process.env.NATS_CLUSTER_ID === undefined) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (process.env.NATS_CLIENT_ID === undefined) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (process.env.NATS_URL === undefined) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);


    natsWrapper.client.on('connect', () => {
      console.log('Connected to NATS');
    });

    natsWrapper.client.on('error', (err) => {
      console.error('Error connecting to NATS:', err);
    });

    process.on('SIGINT', () => natsWrapper.client?.close());
    process.on('SIGTERM', () => natsWrapper.client?.close());

    // new ExpirationCompleteListener(natsWrapper.client).listen();
    // new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    
  } catch (err) {
    console.error(err);
  }


  app.listen(3000, () => {
    // console.log('testing the skaffold ')
    console.log("Listening on 3000");
  });

}



start();
