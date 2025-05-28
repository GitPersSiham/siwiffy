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