import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import OrderCreatedListener from "./event/listener/order-created-listener";
import OrderCancelledListener from "./event/listener/order-cancelled-listener";

const start = async () => {

  // console.log("Starting up....", natsWrapper);
  if (process.env.JWT_KEY === undefined) {
    throw new Error("JWT_KEY must be defined");
  }

  if (process.env.MONGO_URI === undefined) {
    throw new Error("MONGO_URI must be defined");
  }

 if(process.env.NATS_CLUSTER_ID === undefined){
  throw new Error("NATS_CLUSTER_ID must be defined");
 }

  if(process.env.NATS_CLIENT_ID === undefined){
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if(process.env.NATS_URL === undefined){
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


    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");


    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

  } catch (err) {
    console.error(err);
  }


  app.listen(3000, () => {
    // console.log('testing the skaffold ')
    console.log("Listening on 3000");
  });

}



start();
