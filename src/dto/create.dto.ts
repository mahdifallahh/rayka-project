import { IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  id: string;

  @IsString()
  deviceModel: string;

  @IsString()
  name: string;

  @IsString()
  note: string;

  @IsString()
  serial: string;
}
