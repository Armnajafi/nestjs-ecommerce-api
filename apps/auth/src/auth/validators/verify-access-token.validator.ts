import { Validator } from 'mobikit-typescript';
import { VerifyAccessTokenDto } from '../dto/verify-access-token.dto';

export const verifyAccessTokenRules = {
  access_token: {
    required: { value: true, message: '' },
  },
};

export const validateVerifyAccessToken = async (data: VerifyAccessTokenDto) => {
  const validator = new Validator();
  return await validator.validate(data, verifyAccessTokenRules);
};
