import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, TempRegisterTokenPayload } from './auth.types';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async requestOtp(phone: string) {
    // define otp and generate otp with generateOtp() function
    const otp = this.generateOtp();

    // send sms with rabbit queue to user
    console.log(otp);

    // 2 min expire time;
    const expireAt = Date.now() * 2 * 60 * 1000;
    await this.prisma.otpCode.deleteMany({
      where: { phone },
    });

    // create a new otp
    await this.prisma.otpCode.create({
      data: {
        phone,
        otp,
        expireAt: new Date(expireAt),
      },
    });

    // return success
    return { success: true, message: 'OTP sent' };
  }

  async verifyOtp(
    phone: string,
    otp: string,
  ): Promise<{
    success: boolean;
    status?: 'already_registered' | 'need_register';
    access_token?: string;
    temp_token?: string;
    message?: string;
  }> {
    // find otp entry
    const otpEntry = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        otp,
      },
    });

    // return error if otp is not exist
    if (!otpEntry) {
      return { success: false, message: 'Invalid OTP' };
    }

    // return error if otp is expired
    if (otpEntry.expireAt.getTime() < Date.now()) {
      return { success: false, message: 'OTP expired' };
    }

    // find user by input phone number
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    // check if user exist
    if (user) {
      // create a token with payload of user detail
      const payload = {
        phone: user.phone,
        email: user.email,
      };
      const accessToken = this.jwtService.sign(payload);

      // return success message and already registered status
      return {
        success: true,
        status: 'already_registered',
        access_token: accessToken,
      };
    } else {
      // create temproray token for user signup(register)
      const tempToken = this.jwtService.sign({ phone, temp: true });

      // return success message and need register status
      return {
        success: true,
        status: 'need_register',
        temp_token: tempToken,
      };
    }
  }

  async completeRegister(data: {
    temp_token: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<{
    success: boolean;
    access_token?: string;
    message?: string;
  }> {
    try {
      // get is temp and phone number from jwt token
      const payload: TempRegisterTokenPayload = this.jwtService.verify(
        data.temp_token,
      );

      // check if is not temp and phone number is not exist then return error
      if (!payload?.temp || !payload?.phone) {
        return { success: false, message: 'Invalid temp token' };
      }

      // define phone variable from loaded payload
      const phone = payload.phone;

      // get existing user with payload phone number
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser) {
        // user already registered → reject
        return { success: false, message: 'User already registered' };
      }

      // create a new user with the information
      const newUser = await this.prisma.user.create({
        data: {
          phone,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      });

      // payload to create a access_token for user
      const realPayload = {
        phone: newUser.phone,
        email: newUser.email,
      };

      // sign access token with jwt
      const accessToken = this.jwtService.sign(realPayload);

      // return success
      return {
        success: true,
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error in completeRegister:', error);
      return { success: false, message: 'Invalid or expired temp token' };
    }
  }

  checkAccessToken(access_token: string): {
    success: boolean;
    payload?: AccessTokenPayload;
  } {
    try {
      // verify access token
      const payload = this.jwtService.verify<AccessTokenPayload>(access_token);

      return { success: true, payload };
    } catch (error) {
      console.error('Invalid access token:', error);

      return {
        success: false,
      };
    }
  }
  // a function to generate otp with 6 digits
  private generateOtp() {
    return '' + Math.floor(100000 + Math.random() * 900000);
  }
}
