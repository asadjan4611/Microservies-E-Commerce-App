import { requireAuth, validateRequest } from "@asadjan/common_test";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../model/order";
import { OrderStatus } from "@asadjan/common_test";
import { NotFoundError, NotAuthorizedError, BadRequestError } from "@asadjan/common_test";
import { Payment } from "../model/payment";
import stripe from "../stripe";
import PaymentCreatedPublisher from "../event/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";



const router = express.Router();

router.post("/api/payments",
    requireAuth,
    [
        body("token")
            .not()
            .isEmpty()
            .withMessage("Token is required"),
        body("orderId")
            .not()
            .isEmpty()
            .withMessage("OrderId is required")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for a cancelled order");
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).listen({
            id: payment._id.toString(),
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment._id.toString() });
    }

);

export { router as createPaymentRouter };