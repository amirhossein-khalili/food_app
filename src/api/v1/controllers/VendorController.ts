import { Request, Response, NextFunction } from 'express';
import { GenerateSignature, ValidatePassword } from '../utils';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFoodInput, EditVendorInput, VendorLoginInput } from '../dto';
import {
  FindVendorById,
  FindVendorByPhoneNumber,
  UpdateVendor,
  UpdateVendorStatus,
  UpdateVendorStatusAndLocation,
} from '../services';
import { AddFoodService, GetVendorFoods } from '../services/FoodServies';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */
  const vendorInputs = plainToClass(VendorLoginInput, req.body);
  const validationError = await validate(vendorInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  check vendor exist  ----------------------------------------- */

  const { phone, password } = vendorInputs;
  const existingVendor = await FindVendorByPhoneNumber(phone);

  /* ----------------------------------------  validation password and get signature ----------------------------------------- */

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: existingVendor._id,
        phone: existingVendor.phone,
        name: existingVendor.name,
      });
      return res.json({ signature: signature });
    }
  }

  return res.json({ message: 'Login credential is not valid' });
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendorById(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: 'vendor Information Not Found' });
};

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const vendorInputs = plainToClass(EditVendorInput, req.body);
  const validationError = await validate(vendorInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------   check vendor exist  ----------------------------------------- */

  const user = req.user;
  if (user) {
    const existingVendor = await FindVendorById(user._id);

    /* ----------------------------------------  Update Vendor  ----------------------------------------- */

    if (existingVendor !== null) {
      const saveResult = await UpdateVendor(user._id, vendorInputs);
      return res.json({ vendor: saveResult });
    }
  }
  return res.json({ message: 'Unable to Update vendor profile ' });
};

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendorById(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }
  return res.json({ message: 'Unable to Update vendor profile ' });
};

export const UpdateVendorServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { lat, lng } = req.body;

  if (user) {
    const existingVendor = await FindVendorById(user._id);

    if (existingVendor !== null) {
      const status = !existingVendor.serviceAvailable;
      const saveResult = await UpdateVendorStatus(user._id, status);

      return res.json(saveResult);
    }
  }
  return res.json({ message: 'Unable to Update vendor profile ' });
};

// export const UpdateVendorServiceController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;

//   const { lat, lng } = req.body;

//   if (user) {
//     const existingVendor = await FindVendorById(user._id);

//     if (existingVendor !== null) {
//       existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

//       if (lat && lng) {
//         existingVendor.lat = lat;
//         existingVendor.lng = lng;
//       }
//       const saveResult = await UpdateVendorStatusAndLocation(existingVendor, lat, lng);

//       return res.json(saveResult);
//     }
//   }
//   return res.json({ message: 'Unable to Update vendor profile ' });
// };

export const AddFoodController = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const foodInputs = plainToClass(CreateFoodInput, req.body);
  const validationError = await validate(foodInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  check vendor exist  ----------------------------------------- */

  const user = req.user;

  if (user) {
    const vendor = await FindVendorById(user._id);

    if (vendor !== null) {
      /* ----------------------------------------  add vendor Food  ----------------------------------------- */

      const files = req.files as [Express.Multer.File];

      const result = await AddFoodService(
        user._id,
        foodInputs
        // files
      );

      return res.json(result);
    }
  }
  return res.json({ message: 'Unable to Update vendor profile ' });
};

export const GetFoodsController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const foods = await GetVendorFoods(user._id);

    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: 'Foods not found!' });
};
