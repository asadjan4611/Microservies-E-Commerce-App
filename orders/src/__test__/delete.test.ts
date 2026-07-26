import request from "supertest";
import {app}  from "../app";
import {it} from "@jest/globals";
import {Ticket} from "../model/ticket";
import {expect} from "@jest/globals";
import {OrderStatus} from "@asadjan/common_test";


it("marks an order as cancelled", async () => {
    // Create a ticket with Ticket model
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();

    const user = global.signin();

    // Make a request to create an order with this ticket
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket._id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    // Expectation to make sure the order is cancelled
    const updatedOrder = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(updatedOrder.body.status).   
toEqual(OrderStatus.Cancelled);
}); 


// it.todo("emits an order cancelled event");