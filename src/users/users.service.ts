import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignUpDto) {
    const userExists = await this.findUserByEmail(userSignUpDto.email);

    if (userExists) throw new BadRequestException();

    userSignUpDto.password = await hash(userSignUpDto.password, 10);

    const user = this.userRepository.create(userSignUpDto);
    const userSignedUp = await this.userRepository.save(user);

    return plainToInstance(UserDto, userSignedUp, {
      excludeExtraneousValues: true,
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
