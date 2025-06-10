import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('request')
  authRequest(@Body() body: { phone: string }) {
    return this.authClient.send(
      { cmd: 'auth.request-otp' },
      { phone: body.phone },
    );
  }
}
