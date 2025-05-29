// src/interface/http/routes/userRoutes.ts
import { Router } from "express";
import { createUserController } from "../controllers/CreateUserController";
import { cancelUserController } from "../controllers/CancelUserController";
import { updateUserController } from "../controllers/UpdateUserController";

const router = Router();

router.post("/users", createUserController.execute as any);
router.delete("/users/:id", cancelUserController.execute as any);
router.put("/users/:id", updateUserController.execute as any);

export default router;
