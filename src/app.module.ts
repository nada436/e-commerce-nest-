import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersRepository } from './repository/user.repository.service';
import { GlobalModule } from './Global Module';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { CopounModule } from './modules/copoun/copoun.module';
import { cartModel } from './database/models/Cart.Model';
import { OrderModel } from './database/models/Order.Model';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { OrderGraphqlResolver } from './graphql/resolver/order.resolver';
import { OrderService } from './modules/order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URL,
      }),
    }),
  
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  
    GlobalModule,
    CopounModule,
    CartModule,
    OrderModule,
  
    CacheModule.register({
      isGlobal: true,
      ttl: 2000,
    }),
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

