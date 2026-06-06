import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database';
import { UserRow } from '../models';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByName(name: string): Promise<UserRow | undefined> {
    const result = await this.databaseService.query<UserRow>(
      'SELECT id, name, password FROM users WHERE name = $1',
      [name],
    );

    return result.rows[0];
  }

  async create(name: string, password: string): Promise<UserRow> {
    const result = await this.databaseService.query<UserRow>(
      `INSERT INTO users (name, password)
       VALUES ($1, $2)
       RETURNING id, name, password`,
      [name, password],
    );

    return result.rows[0];
  }
}
