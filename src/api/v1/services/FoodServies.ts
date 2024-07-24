import { CreateFoodInput } from '../dto';
import { Food, FoodDoc, Vendor, VendorDoc } from '../models';
import { FindVendorById } from './VendorService';

export const GetVendorFoods = async (id: string): Promise<FoodDoc[]> => {
  const foods = await Food.find({ vendorId: id });

  return foods;
};

export const AddFoodService = async (
  userId: string,
  foodInputs: CreateFoodInput,
  files: Express.Multer.File[]
): Promise<VendorDoc | null> => {
  const vendor = await Vendor.findById(userId);

  const { name, description, category, foodType, readyTime, price } = foodInputs;
  const images = files.map((file) => file.filename);

  const food = await Food.create({
    vendorId: vendor._id,
    name: name,
    description: description,
    category: category,
    price: price,
    rating: 0,
    readyTime: readyTime,
    foodType: foodType,
    images: images,
  });

  vendor.foods.push(food);
  const result = await vendor.save();

  return result;
};
