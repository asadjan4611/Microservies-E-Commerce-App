import mongoose, { Model } from "mongoose";
import {Password} from '../services/password';

interface userAttrs {
  email: string;
  password: string;
}   


interface userModel extends mongoose.Model<any> {
  build(attrs: userAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret:any) {

        // console.log("transfrom is calling ");
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      } 
    },
  }
);



userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
}); 

userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs);
}; 
const User = mongoose.model<UserDoc,userModel>("User", userSchema); //this line is create the model 

 

//  const buildUser = (attrs: userAttrs) => {
//   return new User(attrs);
// };

export { User };        