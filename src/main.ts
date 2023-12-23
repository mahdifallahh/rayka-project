import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
const option = {
  region: 'localhost',
  endpoint: 'http://0.0.0.0:8000',
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey',
  },
};

const client =
  process.env.IS_OFFLINE == 'true'
    ? new DynamoDBClient(option)
    : new DynamoDBClient();

const tableName = 'devicesTable';

const createTable = async (client, tableName) => {
  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };
  await client.send(new CreateTableCommand(params as any));
};

const checkIfTableExists = async (
  client: DynamoDBClient,
  tableName: string,
) => {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    await client.send(command);
    return true;
  } catch (e) {
    return false;
  }
};

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const exists = await checkIfTableExists(client, tableName);
  if (!exists) {
    await createTable(client, tableName);
  }
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
