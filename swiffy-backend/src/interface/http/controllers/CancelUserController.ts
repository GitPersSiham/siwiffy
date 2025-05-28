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
};
