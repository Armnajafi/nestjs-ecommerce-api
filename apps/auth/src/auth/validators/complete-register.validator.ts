import { Validator } from 'mobikit-typescript';
import { CompleteRegisterDto } from '../dto/complete-register.dto';

export const completeRegisterRules = {
  temp_token: {
    required: { value: true, message: '' },
    minLen: { value: 128, message: '' },
    maxLen: { value: 128, message: '' },
  },
  firstName: {
    required: { value: true, message: '' },
    minLen: { value: 2, message: '' },
    maxLen: { value: 20, message: '' },
  },
  lastName: {
    required: { value: true, message: '' },
    minLen: { value: 2, message: '' },
    maxLen: { value: 20, message: '' },
  },
  email: {
    required: { value: true, message: '' },
    email: { value: true, message: '' },
    minLen: { value: 10, message: '' },
    maxLen: { value: 45, message: '' },
  },
};

export const validateCompleteRegister = async (data: CompleteRegisterDto) => {
  const validator = new Validator();
  return await validator.validate(data, completeRegisterRules);
};
