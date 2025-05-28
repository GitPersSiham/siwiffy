// src/interface/http/routes/userRoutes.ts
import { Router } from "express";
import { createUserController, findAllUsersController } from "../controllers/CreateUserController";
import { cancelUserController } from "../controllers/CancelUserController";
import { UpdateUserController } from "../controllers/UpdateUserController";

const router = Router();

router.post("/users", createUserController);
router.get("/users", findAllUsersController);
router.delete("/users/:id", cancelUserController);
router.put("/users/:id", UpdateUserController);


export default router;
