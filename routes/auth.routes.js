import express from 'express';
import { signUp, signIn, logout } from '../controllers/auth.Controller.js';
import { verifyAccessToken } from '../middleware/verifyToken.js';
import { getMe } from '../controllers/auth.Controller.js';

const router = express.Router();

router.get('/me', verifyAccessToken, getMe)

// POST /auth/signup - Register a new user and send OTP
router.post('/signup', signUp);

// POST /auth/signin - Login user; resend OTP if email not verified
router.post('/login', signIn);

// POST /auth/logout - Logout user (client should clear token)
router.post('/logout', logout);

export default router;
