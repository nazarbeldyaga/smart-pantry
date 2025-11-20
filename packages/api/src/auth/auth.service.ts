import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../user/user.entity';

type UserProfile = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<{ user: UserProfile; token: string }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    const { passwordHash: _passwordHash, ...userProfile } = user;
    return { user: userProfile, token };
  }

  async register(dto: RegisterUserDto): Promise<{ user: UserProfile; token: string }> {
    const user = await this.userService.create(dto);

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    const { passwordHash: _passwordHash, ...userProfile } = user;
    return { user: userProfile, token };
  }
}
