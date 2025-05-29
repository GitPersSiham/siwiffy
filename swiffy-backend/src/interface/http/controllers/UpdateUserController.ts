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
