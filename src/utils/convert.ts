export const convertToResponse = (student: any): StudentResponse => {
	return {
		_id: student._id,
		name: student.name,
		studentCode: student.studentCode,
		isActive: student.isActive,
	};
};
