import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { promises } from 'dns';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any, options: JwtSignOptions): Promise<string> {
    return await this.jwtService.sign(payload, options);
  }
  async verifyToken(token: any, options: JwtSignOptions): Promise<any> {
    return await this.jwtService.verify(token, options);
  }
}
