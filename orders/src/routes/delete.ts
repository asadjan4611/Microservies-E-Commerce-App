import express,{Request,Response} from "express";
import { param } from "express-validator";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@asadjan/common_test";
import { Order } from "../model/order";
import { Ticket } from "../model/ticket";
import OrderCancelledPublisher from "../event/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
const  router = express.Router();

router.delete("/api/orders/:orderId",[
    param('orderId')
        .not()
        .isEmpty()
        .withMessage('Order ID is required')
],validateRequest,requireAuth,async (req:Request,res:Response)=>{

       const orderId=req.params.orderId;
       const order = await Order.findById(orderId).populate("ticket");
      //  order
      //  order.userId = req.currentUser!.id;
       if(!order){
         return new NotFoundError();
       }
       if(order.userId !== req.currentUser!.id){
         return new NotAuthorizedError();
       }     

        order.status = OrderStatus.Cancelled;
         await order.save();


          // publish an event saying that this order was cancelled
          await new OrderCancelledPublisher(natsWrapper.client).listen({
                     id:order._id.toString(),
                     version:order.version,
                     ticket:{
                       id:order.ticket._id.toString ()
                     },
                   });
    res.status(204).send(order);
});

export {router as deleteOrderRouter};
