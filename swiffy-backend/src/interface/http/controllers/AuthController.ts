import { Request, Response } from 'express';
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
  }
};
