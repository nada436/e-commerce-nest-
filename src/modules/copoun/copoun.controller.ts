import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CopounService } from './copoun.service';
import { GetUser } from 'src/common/decorator/user.decorator';
import { Createcopoun_dto, updatecopoun_dto } from 'src/common/dto/copoun.dto';
import { Auth } from 'src/common/decorator/auth.decorator';

@Controller('copoun')
export class CopounController {
constructor( private readonly CopounService:CopounService){}
 
   @Post('/new')
    @Auth(['admin'])
    async createcopoun(
      @Body() data: Createcopoun_dto,
      @GetUser() user: string,
    ) {
      return this.CopounService.createCopoun(data, user);
    }

    @Patch('/update/:id')
    @Auth(['admin'])
    async updatecopoun(
      @Param('id') id:String,
      @Body() data: updatecopoun_dto,
      @GetUser() user: string,
    ) {
      return this.CopounService.updateCopoun(id,data, user);
    }

    
    @Delete('/delete/:id')
    @Auth(['admin'])
    async deletecopoun(
      @Param('id') id:String,
      @GetUser() user: string,
    ) {
      return this.CopounService.deleteCopoun(id, user);
    }



}
