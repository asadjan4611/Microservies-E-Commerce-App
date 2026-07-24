import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import TicketCreatedPublisher from "./event/ticket-publisher";

console.clear();

const stan = nats.connect("ticketing", "publisher", {
    url: "nats://localhost:4222",
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");


    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.listen({
            id: randomBytes(4).toString("hex"),
            title: "concert",
            price: 20,
            userId: randomBytes(4).toString("hex"),
        });
    } catch (err) {
        console.error(err);
    }


    //  const data = JSON.stringify({
    //     id: "123",
    //     title: "concert",
    //     price: 20,
    // });

    // stan.publish('ticket:created', data,()=>{
    //     console.log('Event published');
    // });
}
);


