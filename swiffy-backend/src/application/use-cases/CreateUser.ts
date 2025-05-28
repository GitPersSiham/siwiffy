
import { User } from "../../domain/entities/User";

import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../../interface/repositories/IUserRepository";

export class CreateUser {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(user: User): Promise<User> {
    const createdUser = new User({
      id: uuidv4(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date()

    });
    this.userRepository.create(createdUser);
    return createdUser;
  }
}

