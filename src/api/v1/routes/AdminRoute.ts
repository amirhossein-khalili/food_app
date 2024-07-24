import express, { Request, Response, NextFunction } from 'express';
import {} from '../controllers';
import {
  CreateVandorController,
  GetVendorController,
  GetVendorsController,
} from '../controllers/AdminController';

const router = express.Router();

/* ------------------- Vendor  --------------------- */
router.post('/vendor', CreateVandorController);
router.get('/vendors', GetVendorsController);
router.get('/vendor/:id', GetVendorController);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello from  Admin' });
});

export { router as AdminRoute };
