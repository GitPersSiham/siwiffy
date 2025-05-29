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
};
