import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  MaxLength,
  IsDate,
} from 'class-validator';
import { UserRoles } from '../types/types';
import { Type } from 'class-transformer';
import { IsPasswordConfirmed } from '../decorator/confirm_password.decoration';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(107)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPasswordConfirmed({ message: 'Password confirmation does not match the password' })
  confirmPassword: string;

  @IsNotEmpty()
  @Type(() => Date) 
  @IsDate()
  DOB: Date;

  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class login_Dto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}

export class confirm_email_Dto {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}
