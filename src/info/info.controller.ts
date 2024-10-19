import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Info')
@Controller('info')
export class InfoController {
	@Get()
	async getInfo() {
		return { data: { fullName: 'Lê Minh Vương', studentCode: 'QE170148' } };
	}
}
