<<<<<<< HEAD
import { Request, Response } from 'express';
import { User } from '../../../domain/entities/User';
import { UserRepositorySupabase } from '../../../infrastracture/db/repositories/UserRepositorySupabase';

const userRepository = new UserRepositorySupabase();

export const updateUserController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const user = new User({
        id,
        name,
        email,
        password: password || existingUser.password
      });

      if (password) {
        await user.hashPassword();
      }

      const updatedUser = await userRepository.update(user);
      if (!updatedUser) {
        return res.status(400).json({ error: 'Erreur lors de la mise à jour' });
      }

      res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
=======
import { UpdateUser } from "../../../application/use-cases/UpdateUser";
import { Request, Response } from "express";
import { UserRepositoryMongo } from "../../../infrastracture/db/repositories/UserRepositoryMongo";

const userRepository = new UserRepositoryMongo();


export const UpdateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Tous les champs sont requis" });
  }

  const user = await userRepository.findById(id);
    if (!user) {
      res.status(404).json({ error: "User non trouvé" });
    }

    user!.name = name;
    user!.email = email;
    user!.password = password;

    await userRepository.update(user!);
    res.status(200).json({ message: "User updated successfully" });
  }
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
