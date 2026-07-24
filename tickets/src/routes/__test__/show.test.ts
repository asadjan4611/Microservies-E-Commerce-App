// import request from "supertest";
// import { app } from "../../app";
// import { it, expect } from '@jest/globals';
// import {Ticket} from '../../model/ticket';
// import mongoose from "mongoose";


// it('return  a 404 if ticket is not found', async () => {

//     const id = new mongoose.Types.ObjectId().toHexString();
//     await request(app)
//     .get(`/api/tickets/${id}`)
//     .send()
//     .expect(404);
// });

// it('return  a ticket if ticket is found', async () => {
//      const ticket =  await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//         title: 'concert',
//         price: 20
//     })
//     .expect(201);
   

//     const ticketResponse = await request(app)
//     .get(`/api/tickets/${ticket.body.id}`)
//     .send()
//     .expect(200);

//     expect(ticketResponse.body.title).toEqual(ticket.body.title);
//     expect(ticketResponse.body.price).toEqual(ticket.body.price);
// }
// );