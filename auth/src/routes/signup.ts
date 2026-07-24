import Express ,{Request,Response} from 'express';
import { body, validationResult } from 'express-validator';
import {validateRequest} from '@asadjan/common_test'; 
import  Jwt  from 'jsonwebtoken';

import { RequestValidationError } from "@asadjan/common_test";
import { User} from '../models/user';
import { BadRequestError } from '@asadjan/common_test';
const router = Express.Router();

router.post('/api/users/signup', 
    [
        body('email').
        isEmail().
        withMessage('Please provide a valid email'), 
        body('password').
        trim().
        isLength({ min: 4, max: 20 }).
        withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
     async (req:Request, res:Response) => {

    //  validationResult(req);
    //    const errors = validationResult(req);
    //    if (!errors.isEmpty()) {
         

    //      throw new RequestValidationError(errors.array());
    //     // const error= new Error('Invalid email or password');
    //     // error.reasons = errors.array();
    //     // throw error;
    //     // // return res.status(400).send({ errors: errors.array() });
    //    }



    const { email, password } = req.body;
    if (!email || typeof email !== 'string') {
        return res.status(400).send({ message: 'provide a valid email' });
    }

   const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    //generate the token
     const userJwt = Jwt.sign(
        { id: user._id,
         email: user.email },
      process.env.JWT_KEY!
      );

    //   console.log(userJwt);
    //store in session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
});

export { router as signupRouter };