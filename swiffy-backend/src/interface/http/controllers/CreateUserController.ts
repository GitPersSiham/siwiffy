import { Request, Response } from 'express';
import { User } from '../../../domain/entities/User';
import { UserRepositorySupabase } from '../../../infrastracture/db/repositories/UserRepositorySupabase';

const userRepository = new UserRepositorySupabase();

export const createUserController = {
  async execute(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const user = new User({
        name,
        email,
        password
      });

      await user.hashPassword();
      const createdUser = await userRepository.create(user);

      res.status(201).json({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const findAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await userRepository.findAll();
  res.status(200).json(users);
  // console.log("👉 Données reçues dans le GET /api/users :", req.body);
};
