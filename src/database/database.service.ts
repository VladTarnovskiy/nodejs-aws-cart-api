import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

import { DbQuery } from './query-runner';
import { PG_POOL } from './tokens';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async withTransaction<T>(fn: (query: DbQuery) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const query: DbQuery = (text, params) => client.query(text, params);
      const result = await fn(query);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
