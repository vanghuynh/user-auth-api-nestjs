import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Student } from 'src/schemas/student.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StudentsService {
	constructor(
		@InjectModel(Student.name) private readonly studentModel: Model<Student>,
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const createStudent = new this.studentModel({
			fullName: createStudentDto.name,
			studentCode: createStudentDto.studentCode,
			isActive: createStudentDto.isActive,
		});

		await createStudent.save();

		return {
			success: true,
			message: 'Student created successfully',
			data: {
				_id: createStudent._id,
				name: createStudent.fullName,
				studentCode: createStudent.studentCode,
				isActive: createStudent.isActive,
			},
		};
	}

	async getAll() {
		const students = await this.studentModel.find().exec();

		if (!students) {
			throw new NotFoundException('No students found!');
		}

		return {
			success: true,
			data: students.map((student) => ({
				_id: student._id,
				name: student.fullName,
				studentCode: student.studentCode,
				isActive: student.isActive,
			})),
		};
	}

	async getById(id: string) {
		const student = await this.studentModel.findById(id).exec();

		if (!student) {
			throw new NotFoundException('Student not found!');
		}

		return {
			success: true,
			data: {
				_id: student._id,
				name: student.fullName,
				studentCode: student.studentCode,
				isActive: student.isActive,
			},
		};
	}

	async update(id: string, updateStudentDto: UpdateStudentDto) {
		const existingStudent = await this.studentModel.findOne({ _id: id }).exec();

		if (!existingStudent) {
			throw new NotFoundException('Student not found!');
		}

		existingStudent.set({
			...existingStudent,
			fullName: updateStudentDto.name,
			isActive: updateStudentDto.isActive,
		});

		const updatedStudent = await existingStudent.save();

		return {
			success: true,
			message: 'Student updated successfully',
			data: {
				_id: updatedStudent._id,
				name: updatedStudent.fullName,
				studentCode: updatedStudent.studentCode,
				isActive: updatedStudent.isActive,
			},
		};
	}

	async delete(id: string) {
		const existingStudent = await this.studentModel.findOne({ _id: id }).exec();

		if (!existingStudent) {
			throw new NotFoundException('Student not found!');
		}

		await this.studentModel.deleteOne({ _id: id });

		return {
			success: true,
			message: 'Student deleted successfully',
		};
	}
}
