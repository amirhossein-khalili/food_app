import express, { Request, Response, NextFunction } from 'express';
import {
  AddFoodController,
  GetFoodsController,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorServiceController,
  VendorLogin,
  GetCurrentOrdersController,
  ProcessOrderController,
} from '../controllers';
import { Authenticate } from '../middleware';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array('images', 10);

/* --------------------------- Login -------------------------- */
router.post('/login', VendorLogin);

/* --------------------------- Authentication -------------------------- */
router.use(Authenticate);

/* --------------------------- profile -------------------------- */
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);

/* --------------------------- change service -------------------------- */
router.patch('/service', UpdateVendorServiceController);

/* --------------------------- menu -------------------------- */
router.post('/food', images, AddFoodController);
router.get('/food', GetFoodsController);

/* --------------------------- orders -------------------------- */
router.get('/orders', GetCurrentOrdersController);
router.put('/order/process', ProcessOrderController);

export { router as VendorRoute };
