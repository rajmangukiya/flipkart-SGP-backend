import express from 'express';
import { login, signup } from '../controllers/user.js';

export const userRouter = express.Router();

userRouter.post('/auth/signup', signup.validator, signup.controller);

userRouter.post('/auth/login', login.validator, login.controller);