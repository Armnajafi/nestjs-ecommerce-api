import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('request-otp')
  requestOtp(@Body() body: { phone: string }) {
    return this.authClient.send(
      { cmd: 'auth.request-otp' },
      { phone: body.phone },
    );
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { phone: string; otp: string }) {
    return this.authClient.send(
      { cmd: 'auth.verify-otp' },
      { phone: body.phone, otp: body.otp },
    );
  }

  @Post('complete-register')
  completeRegister(
    @Body()
    body: {
      temp_token: string;
      firstName: string;
      lastName: string;
      email: string;
    },
  ) {
    return this.authClient.send(
      { cmd: 'auth.complete-register' },
      {
        temp_token: body.temp_token,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    );
  }

  @Post('verify-access-token')
  verifyAccessToken(@Body() body: { access_token: string }) {
    return this.authClient.send(
      { cmd: 'auth.verify-access-token' },
      {
        access_token: body.access_token,
      },
    );
  }
}
