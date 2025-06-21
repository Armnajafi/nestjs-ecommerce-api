import { Validator } from 'mobikit-typescript';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

export const verifyOtpRules = {
  phone: {
    required: { value: true, message: 'شماره موبایل الزامی است' },
    regex: {
      value: /^(\+98|0)?9\d{9}$/,
      message: 'فرمت شماره موبایل معتبر نیست',
    },
  },
  otp: {
    required: { value: true, message: 'رمز یکبار مصرف الزامی است' },
    minLen: { value: 6, message: 'تعداد رمز یکبار مصرف باید 6 رقم باشد' },
    maxLen: { value: 6, message: 'تعداد رمز یکبار مصرف باید 6 رقم باشد' },
  },
};

export const validateVerifyOtp = async (data: VerifyOtpDto) => {
  const validator = new Validator();
  return await validator.validate(data, verifyOtpRules);
};
