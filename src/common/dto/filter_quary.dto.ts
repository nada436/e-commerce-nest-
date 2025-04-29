import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export class filter_quary{
  @Optional()
  @IsString()
  select?: string;
  @Optional()
  @IsString()
  sort?: string;
  @Optional()
  @IsString()
  page?: Number;

}