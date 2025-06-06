import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('ping')
  ping(@Body() body: { username: string }) {
    return this.authClient.send({ cmd: 'ping' }, { username: body.username });
  }
}
