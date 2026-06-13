import { QueryResult, QueryResultRow } from 'pg';

export type DbQuery = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) => Promise<QueryResult<T>>;
