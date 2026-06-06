import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule, DatabaseService } from './database';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule],
    })
      .overrideProvider(DatabaseService)
      .useValue({ query: jest.fn().mockResolvedValue({ rows: [] }) })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('healthCheck should be truthy', () => {
      expect(appController.healthCheck()).toBeTruthy();
    });
  });
});
