import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { DeliveriesModule } from './deliveries/deliveries.module';

@Module({
  imports: [ProductsModule, CategoriesModule, AuthModule, UsersModule, DeliveriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
