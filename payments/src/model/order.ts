import mongoose from "mongoose";
import { OrderStatus } from "@asadjan/common_test";


interface OrderAttrs {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
    id: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,  
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        versionKey: "version",
        optimisticConcurrency: true,
        toJSON: {
            transform(doc, ret:any) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

// orderSchema.set("versionKey", "version");
// orderSchema.pre("save", function (done) {
//     this.$where = {             
// version: this.get("version") - 1};
//     done();
// });

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price,
        version: attrs.version,
    });
};  


const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };