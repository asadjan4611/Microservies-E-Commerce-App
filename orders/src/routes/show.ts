import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@asadjan/common_test";
import { Order } from "../model/order";
const router = express.Router();

router.get("/api/orders/:orderId",
    [
        param('orderId')
            .not()
            .isEmpty()
            .withMessage('Order ID is required')
            
    ],
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };
