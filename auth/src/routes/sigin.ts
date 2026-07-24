import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Jwt from 'jsonwebtoken';

import { validateRequest } from '@asadjan/common_test';
import { Password } from '../services/password';
import { RequestValidationError } from "@asadjan/common_test";
import { User } from '../models/user';
import { BadRequestError } from '@asadjan/common_test';
import e from 'express';
const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').
            isEmail()
            .withMessage('Please provide a valid email'),
        body('password').
            trim().
            notEmpty().
            withMessage('Password must be provided')
    ],
    validateRequest,

    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }
        // console.log(existingUser);
        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        //generate the token
        const userJwt = Jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email
            },
            process.env.JWT_KEY!
        );

        //store in session object
        req.session = { jwt: userJwt };

        res.status(200).send(existingUser);
        
        //  res.status(200).send({ message: 'Signin route' })
    }
);


export { router as signinRouter };