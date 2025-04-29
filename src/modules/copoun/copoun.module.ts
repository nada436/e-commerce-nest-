import { Module } from '@nestjs/common';
import { CopounService } from './copoun.service';
import { CopounController } from './copoun.controller';
import { couponModel } from 'src/database/models/Copoun.Model';
import { copounRepository } from 'src/repository/copoun.repository.service ';

@Module({
  imports:[couponModel],
  providers: [CopounService,copounRepository],
  controllers: [CopounController]
})
export class CopounModule {}
