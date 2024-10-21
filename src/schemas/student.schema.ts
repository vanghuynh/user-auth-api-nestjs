import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Student {
	@Prop({ required: true, unique: true })
	studentCode: string;

	@Prop({ required: true })
	fullName: string;

	@Prop({ default: true, required: true })
	isActive: boolean;

	@Prop({ default: false })
	isDeleted: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
