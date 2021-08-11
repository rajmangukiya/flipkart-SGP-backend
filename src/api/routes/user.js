import express from 'express';
import { signup } from '../controllers/user.js';

export const userRouter = express.Router();

userRouter.post('/auth/signup', signup.validator, signup.controller);