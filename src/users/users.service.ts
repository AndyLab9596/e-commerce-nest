import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

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

  async signin(userSignInDto: UserSignInDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.password',
        'users.email',
        'users.name',
        'users.id',
        'users.roles',
      ])
      .where('users.email = :email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new BadRequestException();

    const matchedPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchedPassword) throw new BadRequestException();

    return plainToInstance(UserDto, userExists, {
      excludeExtraneousValues: true,
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
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

  async accessToken(user: UserDto) {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME,
      },
    );
  }
}
