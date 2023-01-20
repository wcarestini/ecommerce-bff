import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from 'src/config/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

    const { id, email, password } = await this.prisma.user.findFirst({
      where: {
        email: username,
      },
    });

    console.log(id);

    return { userId: id, username: email, password };

    // return this.users.find((user) => user.username === username);
  }

  async createCredentials({
    name,
    cpf,
    telephone,
    email,
    password,
  }: CreateUserDto) {
    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const invalidUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (invalidUser) {
      throw new HttpException(
        'Não foi possível cadastrar o usuário',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        cpf,
        telephone,
        email,
        password,
      },
    });

    return { name: user.name, email: user.email };
  }
}
