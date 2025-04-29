import { Transform, Type } from "class-transformer";
import { IS_LENGTH, IsDate, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";


export class Createcopoun_dto {
  @IsNotEmpty()
  @IsString()
 
 code: String;

 @IsNotEmpty()
 @Type(() => Number)
  @IsNumber()
  amount: Number;

 @IsNotEmpty()
  @IsDate()

  from_date: Date;

  @IsNotEmpty()
  @IsDate()
 
  to_date: Date;
}



export class updatecopoun_dto {
  @IsNotEmpty()
  @IsString()
 
 code?: String;

 @IsNotEmpty()
 @Type(() => Number)
  @IsNumber()
  amount?: Number;

 @IsNotEmpty()
  @IsDate()
  from_date?: Date;

  @IsNotEmpty()
  @IsDate()
  to_date?: Date;
}
