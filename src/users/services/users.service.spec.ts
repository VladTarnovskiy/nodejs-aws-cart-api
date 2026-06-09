import { Test, TestingModule } from '@nestjs/testing';
import { mockDatabaseServiceProvider } from '../../database/mock-database.service';
import { UsersRepository } from '../repositories';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, mockDatabaseServiceProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
