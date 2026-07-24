import request from 'supertest';
import { app } from '../../app';
import { it, expect, jest } from '@jest/globals';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';


jest.mock('../../nats-wrapper');

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Updated Title',
            price: 100
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'user1'
    });
    await ticket.save();

    await request(app)
        .put(`/api/tickets/${ticket._id}`)
        .send({
            title: 'Updated Title',
            price: 100
        })
        .expect(401);
});

// it('returns a 401 if the user does not own the ticket', async () => {
//     // const ownerId = new mongoose.Types.ObjectId().toHexString();

//     // const cookie = global.signin();

//     const response = await request(app)
//         .post('/api/tickets')
//         .set('Cookie', global.signin())
//         .send({
//             title: 'concert',
//             price: 20
//         }).expect(201);

//     // console.log('Response body:', response.body);

//     // await request(app)
//     //     .put(`/api/tickets/${response.body.id}`)
//     //     .set('Cookie', cookie) // different random user
//     //     .send({
//     //         title: 'Updated Title',
//     //         price: 100
//     //     })
//     //     .expect(401);
// });



it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 100
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid Title',
            price: -10
        })
        .expect(400);
});


it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        }).expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Updated Title',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('Updated Title');
    expect(ticketResponse.body.price).toEqual(100);
});



it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        }).expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Updated Title',
            price: 100
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
}
);