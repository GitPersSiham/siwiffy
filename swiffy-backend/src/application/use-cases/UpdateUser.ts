
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../interface/repositories/IUserRepository";


export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, user: User): Promise<void> {
    const updateUser = await this.userRepository.findById(id);

    if (!updateUser) {
     throw new Error("User not found");

    }

    await this.userRepository.update(user);

  }
}
