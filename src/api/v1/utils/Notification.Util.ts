import { KAVENEGAR_API_KEY, KAVENEGAR_PHONE_NUMBER } from '../../../config';
import { Kavenegar } from 'kavenegar';

/* ------------------- Email --------------------- */

/* ------------------- Notification --------------------- */

/* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  try {
    const client = Kavenegar.KavenegarAPI({
      apikey: KAVENEGAR_API_KEY,
    });

    const params = {
      sender: KAVENEGAR_PHONE_NUMBER,
      receptor: toPhoneNumber,
      message: `Your OTP is ${otp}`,
    };

    const response = client.Send(params);

    return response;
  } catch (error) {
    return false;
  }
};

/* ------------------- Payment --------------------- */

/* ------------------- SMS --------------------- */
