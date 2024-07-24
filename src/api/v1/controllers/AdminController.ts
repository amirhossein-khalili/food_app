import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import {
  GetVendorWithPhone,
  CreateVendor,
  GetVendors,
  FindVendorByPhoneNumber,
  FindVendorById,
} from '../services';
import { CreateVandorInput } from '../dto';

export const CreateVandorController = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const vendorInputs = plainToClass(CreateVandorInput, req.body);

  const validationError = await validate(vendorInputs, { validationError: { target: false } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const { phone } = vendorInputs;
  const existingVandor = await GetVendorWithPhone(phone);

  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  if (existingVandor !== null)
    return res.json({ message: 'A vandor is exist with this phone number' });

  const createdVandor = await CreateVendor(vendorInputs);

  return res.json(createdVandor);
};

export const GetVendorsController = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  check pagination items  ----------------------------------------- */

  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  /* ----------------------------------------  fetch vendors data  ----------------------------------------- */

  const vendors = await GetVendors(page, perPage);

  if (vendors.docs.length > 0) return res.json(vendors);

  return res.status(404).json({ message: 'Vendors data not available' });
};

export const GetVendorController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const vendor = await FindVendorById(id as string);

  if (vendor !== null) return res.json(vendor);
  else return res.status(404).json({ message: 'Vendor not found' });
};

// export const GetVendorController = async (req: Request, res: Response, next: NextFunction) => {
//   const { id, phoneNumber } = req.query;

//   let vendor = null;
//   if (phoneNumber) vendor = await FindVendorByPhoneNumber(phoneNumber as string);
//   else if (id) vendor = await FindVendorById(id as string);

//   if (vendor !== null) return res.json(vendor);
//   else return res.status(404).json({ message: 'Vendor not found' });
// };
