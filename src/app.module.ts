import { Module } from '@nestjs/common';
import { InfoModule } from './info/info.module';
import { StudentsModule } from './students/students.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.DATABASE_URL),
		InfoModule,
		StudentsModule,
	],
})
export class AppModule {}
