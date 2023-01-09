import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const isHashPasswordOk = await compare(password, user.password);

    if (user && isHashPasswordOk) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      batata: 'eh-us-guri-de-alvorada',
    };

    return {
      expireIn: '60s',
      access_token: this.jwtService.sign(payload),
    };
  }
}
