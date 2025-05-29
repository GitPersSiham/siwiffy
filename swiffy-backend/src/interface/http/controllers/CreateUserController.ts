<<<<<<< HEAD
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
=======
import { CreateUser } from '../../../application/use-cases/CreateUser';
import { UserRepositoryMongo } from '../../../infrastracture/db/repositories/UserRepositoryMongo';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
const userRepository = new UserRepositoryMongo();
const createUserUseCase = new CreateUser(userRepository);
import bcrypt from 'bcrypt';
import { UserModel } from '../../../infrastracture/db/models/UserModel';

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.warn('❌ Données manquantes :', req.body);
      res.status(400).json({ error: 'Tous les champs sont requis' });
      return;
    }
    // Vérification si l'email existe déjà
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      return; // ✅ AJOUTER CE RETURN !
    }

    if (!password || password.length < 8) {
      res.status(400).json({
        field: 'password',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserUseCase.execute({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Utilisateur créé :', user);
    res.status(201).json(user);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);

    res.status(500).json({ error: 'Erreur interne du serveur' });
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
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
