import express from 'express';
import {
  CustomerLogin,
  CustomerSignUp,
  EditCustomerProfile,
  GetCustomerProfile,
  AddToCartController,
  GetCartController,
  DeleteCartController,
  CreatePayment,
} from '../controllers';
import { Authenticate } from '../middleware';

const router = express.Router();

/* ------------------- Signup / Customer  --------------------- */
router.post('/signup', CustomerSignUp);

/* ------------------- Login --------------------- */
router.post('/login', CustomerLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Profile --------------------- */
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

/* ------------------- Cart --------------------- */
router.post('/cart', AddToCartController);
router.get('/cart', GetCartController);
router.delete('/cart', DeleteCartController);

/* ------------------- Payment --------------------- */
router.post('/create-payment', CreatePayment);

export { router as CustomerRoute };
