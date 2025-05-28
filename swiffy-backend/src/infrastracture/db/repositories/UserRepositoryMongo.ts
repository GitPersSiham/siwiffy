import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../interface/repositories/IUserRepository';
import { UserModel } from '../models/UserModel';
import { Document } from 'mongoose';

interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  googleAccessToken?: string;
}

export class UserRepositoryMongo implements IUserRepository {
  async create(user: User): Promise<User> {
    const userDocument = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const saveUser = await userDocument.save();
    return new User({
      id: saveUser.id.toString(),
      name: saveUser.name,
      email: saveUser.email,
      password: saveUser.password,
      createdAt: saveUser.createdAt,
      updatedAt: saveUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User> {
    const userDocument = await UserModel.findById(id);
    if (!userDocument) throw new Error('User not found');
    return new User({
      id: userDocument.id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
    });
  }

  async update(user: User): Promise<User> {
    const userDocument = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (!userDocument) throw new Error('User not found');
    return new User({
      id: userDocument.id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<User[]> {
    const userDocuments = await UserModel.find();
    return userDocuments.map(
      (userDocument) =>
        new User({
          id: userDocument.id.toString(),
          name: userDocument.name,
          email: userDocument.email,
          password: userDocument.password,
          createdAt: userDocument.createdAt,
          updatedAt: userDocument.updatedAt,
        })
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email }).exec() as IUserDocument | null;
      
      if (!user) {
        return null;
      }

      return new User({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error('Erreur lors de la recherche par email:', error);
      return null;
    }
  }
}
