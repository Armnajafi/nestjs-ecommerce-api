import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.request-otp' })
  requestOtp(data: { phone: string }) {
    return this.authService.requestOtp(data.phone);
  }

  @MessagePattern({ cmd: 'auth.verify-otp' })
  verifyOtp(data: { phone: string; otp: string }) {
    return this.authService.verifyOtp(data.phone, data.otp);
  }

  @MessagePattern({ cmd: 'auth.complete-register' })
  completeRegister(data: {
    temp_token: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    return this.authService.completeRegister(data);
  }

  @MessagePattern({ cmd: 'auth.check-access-token' })
  checkAccessToken(data: { access_token: string }) {
    return this.authService.checkAccessToken(data.access_token);
  }
}
