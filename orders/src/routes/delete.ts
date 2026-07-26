import express,{Request,Response} from "express";
import { body } from "express-validator";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@asadjan/common_test";
import { Order } from "../model/order";
import { Ticket } from "../model/ticket";
const  router = express.Router();

router.delete("/api/orders/:orderId",[
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('Ticket ID is required')
],validateRequest,requireAuth,async (req:Request,res:Response)=>{

       const orderId=req.params.orderId;
       const order = await Order.findById(orderId);
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
         
    res.status(204).send(order);
});

export {router as deleteOrderRouter};