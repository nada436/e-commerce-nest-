import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { BrandModel, CategoryModel, SubCategoryModel, usermodel } from './database/models';
import { AuthGuard } from './common/guards/Authentication';
import { AuthService } from './common/security/jwt_service';
import { JwtService } from '@nestjs/jwt';
import { CategoryModule } from './modules/category/category.module';
import { UsersModule } from './modules/users/users.module';
import { UsersRepository } from './repository/user.repository.service';
import { categoyRepository } from './repository/Category.repository.service ';
import { ProductModule } from './modules/product/product.module';
import { ProductModel } from './database/models/productModel';
import { productRepository } from './repository/product.repository.service';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { BrandModule } from './modules/brand/brand.module';
import { BrandRepository } from './repository/Brand.repository.service';
import { SubCategoryRepository } from './repository/SubCategory.repository.service';
import { FileUploadService } from './common/services/cloudinary/uploud_file.service';
import { OrderService } from './modules/order/order.service';
import { OrderModel } from './database/models/Order.Model';

@Global()
@Module({
  imports: [UsersModule, CategoryModule,usermodel,CategoryModel,ProductModule,ProductModel,SubcategoryModule,BrandModule,BrandModel,SubCategoryModel], 
  providers: [ AuthService, JwtService, AuthGuard,JwtService, UsersRepository,categoyRepository,productRepository,BrandRepository,SubCategoryRepository,FileUploadService],
  exports: [AuthService, AuthGuard,UsersRepository,categoyRepository,productRepository,BrandRepository,SubCategoryRepository,FileUploadService],
})
export class GlobalModule {}
