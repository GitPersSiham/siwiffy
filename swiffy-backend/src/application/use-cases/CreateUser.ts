<<<<<<< HEAD
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
=======

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
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
  }
}

