import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import request from 'supertest';


   declare global {
     var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfghjkl';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri,{});
}, 60000);


// beforeEach(async () => {
//     const collections = await mongoose.connection.db.collections();

//     for (let collection of collections) {
//         await collection.deleteMany({});
//     }
// });


beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
 
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// afterAll(async () => {


//      if(mongo){

//      }
//     await mongo.stop();
//     await mongoose.connection.close();
//     // await mongoose.disconnect();
// }); 

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
}, 60000);
// function beforeAll(fn: () => Promise<void>) {
//   // Delegate to Jest's global beforeAll
//   // (use any to avoid TypeScript issues with the global type)
//   return (global as any).beforeAll(fn);
// }



global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password'; 

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    if (!cookie) {
        throw new Error("Expected cookie but got undefined.");
    }

    return cookie;
};