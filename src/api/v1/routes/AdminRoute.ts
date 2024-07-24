import express, { Request, Response, NextFunction } from 'express';
import {} from '../controllers';
import {
  CreateVandorController,
  GetVendorController,
  GetVendorsController,
  GetTransactionsController,
  GetTransactionByIdController,
  GetTransactionsCustomerController,
} from '../controllers/AdminController';

const router = express.Router();

/* ------------------- Vendor  --------------------- */
router.post('/vendor', CreateVandorController);
router.get('/vendors', GetVendorsController);
router.get('/vendor/:id', GetVendorController);

/* ------------------- Transaction --------------------- */
router.get('/transactions', GetTransactionsController);
router.get('/customer-transactions/:id', GetTransactionsCustomerController);
router.get('/transaction/:id', GetTransactionByIdController);

export { router as AdminRoute };
