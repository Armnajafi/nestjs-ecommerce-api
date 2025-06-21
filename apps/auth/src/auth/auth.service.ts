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
  private readonly MAX_REQUESTS = 1; // Maximum allowed requests
  private readonly REQUEST_WINDOW = 2 * 60 * 1000; // Time window (2 minutes)
  private JWT_SECRET = process.env.JWT_SECRET;

  async requestOtp(phone: string) {
    const currentTime = Date.now();

    // Get the count of requests in the last REQUEST_WINDOW for the given phone number
    const requestCount = await this.prisma.otpCode.count({
      where: {
        phone,
        createdAt: {
          gte: new Date(currentTime - this.REQUEST_WINDOW), // Filter requests within the time window
        },
      },
    });

    // Check if the request count exceeds the maximum allowed
    if (requestCount >= this.MAX_REQUESTS) {
      return {
        success: false,
        message: 'Too many requests, please try again later.',
      };
    }

    // Generate the OTP using the generateOtp() method
    const otp = this.generateOtp();

    // Log the OTP (in a real application, send it via SMS)
    console.log(otp);

    // Set expiration time for the OTP (2 minutes)
    const expireAt = new Date(Date.now() + 2 * 60 * 1000);

    // Create a new OTP record in the database
    await this.prisma.otpCode.create({
      data: {
        phone,
        otp,
        expireAt,
      },
    });

    // Return success response
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
      const accessToken = this.jwtService.sign(payload, {
        secret: this.JWT_SECRET,
      });

      // return success message and already registered status
      return {
        success: true,
        status: 'already_registered',
        access_token: accessToken,
      };
    } else {
      // create temproray token for user signup(register)
      const tempToken = this.jwtService.sign(
        { phone, temp: true },
        { secret: this.JWT_SECRET },
      );

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
        { secret: this.JWT_SECRET },
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
      const accessToken = this.jwtService.sign(realPayload, {
        secret: this.JWT_SECRET,
      });

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

  verifyAccessToken(access_token: string): {
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
