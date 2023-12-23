import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let mockDynamoDBClient;

  beforeEach(async () => {
    mockDynamoDBClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DynamoDBClient,
          useValue: mockDynamoDBClient,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createDevice => Should create a new device and return its data', async () => {
    // arrange
    const deviceDto = {
      id: '/devices/id1',
      deviceModel: '/devicemodels/id1',
      name: 'Sensor',
      note: 'Testing a sensor.',
      serial: 'A020000102',
    };
    const commandResult = {
      /* command result */
    };
    jest.spyOn(mockDynamoDBClient, 'send').mockResolvedValue(commandResult);

    // act
    const result = await service.createDevice(deviceDto);

    // assert
    expect(mockDynamoDBClient.send).toBeCalled();
    expect(result).toEqual(commandResult);
  });
  it('createDevice => Should throw an error when DynamoDB fails', async () => {
    // arrange
    const deviceDto = {
      id: '/devices/id1',
      deviceModel: '/devicemodels/id1',
      name: 'Sensor',
      note: 'Testing a sensor.',
      serial: 'A020000102',
    };
    const error = new Error('DynamoDB error');
    jest.spyOn(mockDynamoDBClient, 'send').mockRejectedValue(error);

    // act and assert
    await expect(service.createDevice(deviceDto)).rejects.toThrow(error);
  });

  it('createDevice => Should throw a BadRequestException when payload fields are missing', async () => {
    // arrange
    const deviceDto = {
      id: '/devices/id1',
      deviceModel: '/devicemodels/id1',
      name: 'Sensor',
      // note: 'Testing a sensor.', // Missing note field
      serial: 'A020000102',
    };
    const error = new BadRequestException(
      'Bad request: Payload fields are missing',
    );
    jest.spyOn(mockDynamoDBClient, 'send').mockRejectedValue(error);

    // act and assert
    await expect(service.createDevice(deviceDto as any)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('findOne => Should find a device and return its data', async () => {
    // arrange
    const id = '/devices/id1';
    const device = {
      id: id,
      deviceModel: '/devicemodels/id1',
      name: 'Sensor',
      note: 'Testing a sensor.',
      serial: 'A020000102',
    };
    const commandResult = {
      Item: device,
    };
    jest.spyOn(mockDynamoDBClient, 'send').mockResolvedValue(commandResult);

    // act
    const result = await service.findOne(id);

    // assert
    expect(mockDynamoDBClient.send).toBeCalled();
    expect(result).toEqual(device);
  });

  it('findOne => Should throw a NotFoundException when device does not exist', async () => {
    // arrange
    const id = '/devices/id1';
    const commandResult = {};
    jest.spyOn(mockDynamoDBClient, 'send').mockResolvedValue(commandResult);

    // act and assert
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('findOne => Should throw an InternalServerErrorException when DynamoDB fails', async () => {
    // arrange
    const id = '/devices/id1';
    const error = new Error('DynamoDB error');
    jest.spyOn(mockDynamoDBClient, 'send').mockRejectedValue(error);

    // act and assert
    await expect(service.findOne(id)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
