import  request from 'supertest';
import { app } from '../../../auth/src/app';
import mongoose from 'mongoose';
import { Order } from '../model/order';
import { Ticket } from '../model/ticket';
import { OrderStatus } from '@asadjan/common_test';
import {it} from "@jest/globals";




it('return an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('return an error if the ticket is already reserved', async () => {
    const title = 'concert';
    const ticket = Ticket.build({
        title,
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'alskdjflasjdf',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket._id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket._id })
        .expect(201);
}); 


// it.todo('emits an order created event', async () => {});

