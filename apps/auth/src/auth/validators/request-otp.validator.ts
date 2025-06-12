import { Validator } from 'mobikit-typescript';
import { RequestOtpDto } from '../dto/request-otp.dto';

export const requestOtpRules = {
  phone: {
    required: { value: true, message: 'شماره موبایل الزامی است' },
    regex: {
      value: /^(\+98|0)?9\d{9}$/,
      message: 'فرمت شماره موبایل معتبر نیست',
    },
  },
};

export const validateRequestOtp = async (data: RequestOtpDto) => {
  const validator = new Validator();
  return await validator.validate(data, requestOtpRules);
};
