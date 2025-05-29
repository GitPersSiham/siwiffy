import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../../domain/entities/User';
import { UserRepositorySupabase } from '../../../infrastracture/db/repositories/UserRepositorySupabase';

const userRepository = new UserRepositorySupabase();

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  register: async (req: Request, res: Response) => {
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

      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
