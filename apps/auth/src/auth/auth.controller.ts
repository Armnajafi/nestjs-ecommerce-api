import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

// service input validators
import { validateRequestOtp } from './validators/request-otp.validator';
import { validateVerifyOtp } from './validators/verify-otp.validator';
import { validateVerifyAccessToken } from './validators/verify-access-token.validator';
import { validateCompleteRegister } from './validators/complete-register.validator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.request-otp' })
  async requestOtp(data: { phone: string }) {
    // validation rule
    const validateError = await validateRequestOtp(data);
    if (validateError) {
      // return validator error message
      return { success: false, errors: validateError };
    }

    // call service and get response
    return this.authService.requestOtp(data.phone);
  }

  @MessagePattern({ cmd: 'auth.verify-otp' })
  async verifyOtp(data: { phone: string; otp: string }) {
    // validation rule
    const validateError = await validateVerifyOtp(data);
    if (validateError) {
      // return validator error message
      return { success: false, errors: validateError };
    }

    // call service and get response
    return this.authService.verifyOtp(data.phone, data.otp);
  }

  @MessagePattern({ cmd: 'auth.complete-register' })
  async completeRegister(data: {
    temp_token: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    // validation rule
    const validateError = await validateCompleteRegister(data);
    if (validateError) {
      // return validator error message
      return { success: false, errors: validateError };
    }
    return this.authService.completeRegister(data);
  }

  @MessagePattern({ cmd: 'auth.verify-access-token' })
  async verifyAccessToken(data: { access_token: string }) {
    // validation rule
    const validateError = await validateVerifyAccessToken(data);
    if (validateError) {
      // return validator error message
      return { success: false, errors: validateError };
    }
    return this.authService.verifyAccessToken(data.access_token);
  }
}
