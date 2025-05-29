<<<<<<< HEAD
import { Request, Response } from 'express';
import { UserRepositorySupabase } from '../../../infrastracture/db/repositories/UserRepositorySupabase';

const userRepository = new UserRepositorySupabase();

export const cancelUserController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userRepository.delete(id);
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
=======
import { UserRepositoryMongo } from "../../../infrastracture/db/repositories/UserRepositoryMongo";
import { CancelUser } from "../../../application/use-cases/CancelUser";
import { Request, Response } from "express";

const userRepository = new UserRepositoryMongo();
const cancelUserUseCase = new CancelUser(userRepository);
export const cancelUserController = async (req: Request, res: Response) => {
  try {
  const userId = req.params.id;
  await cancelUserUseCase.execute(userId);
  res.status(200).json({ message: "User cancelled successfully" });
} catch (error: any) {
  res.status(400).json({ error: error.message });
}
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
};
