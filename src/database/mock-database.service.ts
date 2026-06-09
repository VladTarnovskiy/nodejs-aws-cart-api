import { DatabaseService } from './database.service';

export const mockDatabaseServiceProvider = {
  provide: DatabaseService,
  useValue: {
    query: async () => ({ rows: [] }),
  },
};
