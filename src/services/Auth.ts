import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from '../models/User';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}
export default class AuthUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const users = getRepository(User);

    const user = await users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMacthed = await compare(password, user.password);

    if (!passwordMacthed) {
      throw new Error('Credenciais inválidas');
    }
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
