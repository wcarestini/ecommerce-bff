import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'usuario',
      password: '$2b$10$7ou1rfCTFQC7FthGpySzL.BCxTFFs3WNckk3NyKuvnMGMvD7phFRa',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    // const salt = genSaltSync(10);
    // const hash = hashSync('senha', salt);

    return this.users.find((user) => user.username === username);
  }
}
