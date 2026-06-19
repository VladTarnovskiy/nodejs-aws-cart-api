import { Injectable } from '@nestjs/common';

import { User } from '../models';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(name: string): Promise<User | undefined> {
    return this.usersRepository.findByName(name);
  }

  async createOne({ name, password }: User): Promise<User> {
    return this.usersRepository.create(name, password);
  }
}
