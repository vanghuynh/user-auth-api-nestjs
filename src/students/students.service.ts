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
		const existingStudent = await this.studentModel
			.findOne({
				studentCode: createStudentDto.studentCode,
			})
			.exec();

		if (existingStudent) {
			throw new ConflictException('Student already exists!');
		}

		const createStudent = new this.studentModel({
			...createStudentDto,
		});

		await createStudent.save();

		const student = createStudent.toObject();
		delete student.isDeleted;

		return {
			success: true,
			message: 'Student created successfully',
			data: student,
		};
	}

	async getAll() {
		const students = await this.studentModel
			.find({ isDeleted: false })
			.select('-isDeleted')
			.exec();

		if (!students) {
			throw new NotFoundException('No students found!');
		}

		return {
			success: true,
			data: students,
		};
	}

	async getById(id: string) {
		const student = await this.studentModel
			.findById({ id, isDeleted: false })
			.select('-isDeleted')
			.exec();

		if (!student) {
			throw new NotFoundException('Student not found!');
		}

		return {
			success: true,
			data: student,
		};
	}

	async update(id: string, updateStudentDto: UpdateStudentDto) {
		const existingStudent = await this.studentModel
			.findOne({ _id: id, isDeleted: false })
			.exec();

		if (!existingStudent) {
			throw new NotFoundException('Student not found!');
		}

		existingStudent.set(updateStudentDto);

		const updatedStudent = await existingStudent.save();

		const student = updatedStudent.toObject();
		delete student.isDeleted;

		return {
			success: true,
			message: 'Student updated successfully',
			data: student,
		};
	}

	async delete(id: string) {
		const existingStudent = await this.studentModel
			.findOne({ _id: id, isDeleted: false })
			.exec();

		if (!existingStudent) {
			throw new NotFoundException('Student not found!');
		}

		existingStudent.set({ isDeleted: true });

		await existingStudent.save();

		return {
			success: true,
			message: 'Student deleted successfully',
		};
	}
}
