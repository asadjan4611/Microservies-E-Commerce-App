import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, beforeEach, afterAll, jest } from "@jest/globals";
import request from 'supertest';
import jwt from "jsonwebtoken";


   declare global {
     var signin: () => string[];
}

jest.mock('../nats-wrapper');


let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfghjkl';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri,{});
});


// beforeEach(async () => {
//     const collections = await mongoose.connection.db.collections();

//     for (let collection of collections) {
//         await collection.deleteMany({});
//     }
// });


beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
 
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
    await mongoose.connection.close();

    if (mongo) {
      await mongo.stop();
    }
    // await mongoose.disconnect();
}); 

// afterAll(async () => {
//   if (mongo) {
//     await mongo.stop();
//   }
//   await mongoose.connection.close();
// });
// // function beforeAll(fn: () => Promise<void>) {
// //   // Delegate to Jest's global beforeAll
// //   // (use any to avoid TypeScript issues with the global type)
// //   return (global as any).beforeAll(fn);
// // }

// afterAll(async () => {
//   console.log("1. Entered afterAll");

//   if (mongo) {
//     console.log("2. Stopping Mongo...");
//     await mongo.stop();
//     console.log("3. Mongo stopped");
//   }

//   console.log("4. Closing mongoose...");
//   await mongoose.connection.close();
//   console.log("5. Mongoose closed");
// });



global.signin =  () => {

  // build a JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
    //build session Object. {jwt: MY_JWT}
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');


  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
