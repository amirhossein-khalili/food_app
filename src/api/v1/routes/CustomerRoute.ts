import express from 'express';
import {
  CustomerLogin,
  CustomerSignUp,
  EditCustomerProfile,
  GetCustomerProfile,
} from '../controllers';
import { Authenticate } from '../middleware';

const router = express.Router();

/* ------------------- Suignup / Customer  --------------------- */
router.post('/signup', CustomerSignUp);

/* ------------------- Login --------------------- */
router.post('/login', CustomerLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Profile --------------------- */
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

export { router as CustomerRoute };
