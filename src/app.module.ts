import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://jesus:12345@localhost:27018/')],
  controllers: [],
  providers: [],
})
export class AppModule {}
