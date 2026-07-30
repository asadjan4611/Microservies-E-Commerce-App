import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  console.log("Starting up auth service... testing the deployment"); ");

  if(process.env.JWT_KEY === undefined){
    throw new Error("JWT_KEY must be defined");
  }

  if(process.env.MONGO_URI === undefined){
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }


  app.listen(3000, () => {
    // console.log('testing the skaffold ')
    console.log("Listening on 3000");
  });

}



start();
