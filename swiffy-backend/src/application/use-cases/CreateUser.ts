import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../interface/repositories/IUserRepository';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: { name: string; email: string; password: string }): Promise<User> {
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });

    await user.hashPassword();
    return this.userRepository.create(user);
  }
}

