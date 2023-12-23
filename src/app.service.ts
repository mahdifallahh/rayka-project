import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create.dto';
@Injectable()
export class AppService {
  constructor(private dynamoDB: DynamoDBClient) {}

  async createDevice(device: CreateDeviceDto): Promise<any> {
    const deviceObj = {
      ...device,
    };
    try {
      const command = new PutCommand({
        TableName: 'devicesTable',
        Item: deviceObj,
      });
      return await this.dynamoDB.send(command);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException('Bad request: ' + e.message);
      } else {
        throw new InternalServerErrorException(
          'Internal server error: ' + e.message,
        );
      }
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const command = new GetCommand({
        TableName: 'devicesTable',
        Key: { id },
      });
      const result = await this.dynamoDB.send(command);
      if (!result.Item) {
        throw new NotFoundException(`Device with id ${id} not found`);
      }
      return result.Item;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException('Not found: ' + e.message);
      } else {
        throw new InternalServerErrorException(
          'Internal server error: ' + e.message,
        );
      }
    }
  }
}

