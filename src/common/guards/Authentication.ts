import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql'; 
import { UsersRepository } from 'src/repository/user.repository.service';
import { AuthService } from '../security/jwt_service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly AuthService: AuthService,
    private readonly UsersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;

 
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getContext().req) {
      // If it's a GraphQL request
      request = gqlContext.getContext().req;
    } else {
      // If it's an HTTP request
      request = context.switchToHttp().getRequest();
    }

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.AuthService.verifyToken(token, {
        secret: process.env.secret_key,
      });
      const user = await this.UsersRepository.findOne({ _id: decoded._id });
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
