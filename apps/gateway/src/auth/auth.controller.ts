import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('ping')
  async ping(): Promise<unknown> {
    return this.authClient.send({ cmd: 'ping' }, {}).toPromise();
  }
}
