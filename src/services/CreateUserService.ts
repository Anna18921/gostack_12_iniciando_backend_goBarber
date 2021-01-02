import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

interface Response {
  user: User;
}

export default class CreateUserService {
  public async execute({
    email,
    password,
    name,
  }: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(User);

    const checkUserExits = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExits) {
      throw new Error('Email address already registred.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return { user };
  }
}
