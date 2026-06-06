import { DatabaseService } from './database.service';

export const mockDatabaseServiceProvider = {
  provide: DatabaseService,
  useValue: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  },
};
