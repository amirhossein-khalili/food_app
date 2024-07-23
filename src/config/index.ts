import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const APP_SECRET = process.env.APP_SECRET;
export const PORT = process.env.PORT;
export const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY;
export const KAVENEGAR_PHONE_NUMBER = process.env.KAVENEGAR_PHONE_NUMBER;
