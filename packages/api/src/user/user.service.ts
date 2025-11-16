import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException('Користувач з таким username вже існує');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = new User();
    newUser.username = dto.username;
    newUser.email = dto.email;
    newUser.passwordHash = passwordHash;

    return this.userRepo.create(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findByEmail(email);
  }
}
