import express from 'express';
import { CustomerLogin, CustomerSignUp } from '../controllers';
import { Authenticate } from '../middleware';

const router = express.Router();

/* ------------------- Suignup / Customer  --------------------- */
router.post('/signup', CustomerSignUp);

/* ------------------- Login --------------------- */
router.post('/login', CustomerLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

export { router as CustomerRoute };
