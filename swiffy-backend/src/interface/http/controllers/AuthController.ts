import { Request, Response } from 'express';
<<<<<<< HEAD
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
=======
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Assurez-vous que le chemin est correct
import { validationResult } from 'express-validator'; // Importez validationResult
import { UserModel } from '../../../infrastracture/db/models/UserModel';

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    console.log(user, 'user....................');

    if (!user) {
      res.status(401).json({ error: 'Identifiants incorrects' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid, 'isPasswordValid');

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Identifiants incorrects' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your_secret_key',
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
  }
};
