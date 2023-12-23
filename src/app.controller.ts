import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDeviceDto } from './dto/create.dto';

@UsePipes(
  new ValidationPipe({
    transform: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints).join(', '),
        })),
      );
    },
  }),
)
@Controller('devices')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createDevice(): Promise<string> {
    const params: CreateDeviceDto = {
      id: '/devices/id1',
      deviceModel: '/devicemodels/id1',
      name: 'Sensor',
      note: 'Testing a sensor.',
      serial: 'A020000102',
    };

    try {
      await this.appService.createDevice(params as any);
      return 'Item successfully created';
    } catch (error) {
      console.error('error======>>>>>', error);
      return 'Error occurred===>' + error;
    }
  }
  @Get(':id(*)')
  async get(@Param('id') id: string): Promise<any> {
    console.log('id:', id);
    const device = this.appService.findOne(id);
    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }
    return device;
  }
}
