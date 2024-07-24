import { Order, Vendor, VendorDoc } from '../models';
import { GeneratePassword, GenerateSalt } from '../utils';
import { CreateVandorInput, EditVendorInput } from '../dto';

export const GetVendorWithPhone = async (phone: string): Promise<VendorDoc> => {
  const vendor = await Vendor.findOne({ phone: phone });

  return vendor;
};

export const CreateVendor = async (input: CreateVandorInput): Promise<VendorDoc> => {
  const { name, address, pincode, foodType, password, ownerName, phone } = <CreateVandorInput>input;

  //generate a salt

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  // encrypt the password using the salt

  const vendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    lat: 0,
    lng: 0,
  });

  return vendor;
};

export const GetVendors = async (page = 1, perPage = 10) => {
  const options = {
    page: page,
    limit: perPage,
  };

  const vendors = await Vendor.paginate({}, options);
  return vendors;
};

export const FindVendorById = async (id: string): Promise<VendorDoc | null> => {
  return await Vendor.findById(id);
};

export const FindVendorByPhoneNumber = async (phoneNumber: string): Promise<VendorDoc | null> => {
  return await Vendor.findOne({ phone: phoneNumber });
};

export const UpdateVendor = async (id: string, input: EditVendorInput): Promise<VendorDoc> => {
  const { foodType, name, address, phone } = input;

  const vendor = await Vendor.findByIdAndUpdate(id, {
    name: name,
    address: address,
    phone: phone,
    foodType: foodType,
  });

  return vendor;
};

export const UpdateVendorStatus = async (id: string, status: boolean): Promise<VendorDoc> => {
  return await Vendor.findByIdAndUpdate(id, { serviceAvailable: status });
};

export const UpdateVendorStatusAndLocation = async (
  vendor: VendorDoc,
  lat?: number,
  lng?: number
): Promise<VendorDoc> => {
  vendor.serviceAvailable = !vendor.serviceAvailable;
  if (lat && lng) {
    vendor.lat = lat;
    vendor.lng = lng;
  }
  return await vendor.save();
};

export const FindCurrentOrders = async (id: string) => {
  return await Order.find({ vendorId: id, status: 'pending' });
};

export const UpdateCurrentOrders = async (id: string) => {
  return await Order.find({ vendorId: id, status: 'pending' });
};
