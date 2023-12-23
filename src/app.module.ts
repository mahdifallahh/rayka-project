import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDB, DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,

      useFactory: () => {
        const option = {
          region: 'localhost',
          endpoint: 'http://0.0.0.0:8000',
          credentials: {
            accessKeyId: 'MockAccessKeyId',
            secretAccessKey: 'MockSecretAccessKey',
          },
        };
        if (process.env.IS_OFFLINE == 'true') {
          const dynamodbClient = new DynamoDBClient(option);
          return new AppService(dynamodbClient);
        } else {
          const dynamodbClient = new DynamoDBClient();
          return new AppService(dynamodbClient);
        }
      },
    },
  ],
})
export class AppModule {}
