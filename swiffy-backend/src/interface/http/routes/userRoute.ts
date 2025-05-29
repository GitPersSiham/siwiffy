// src/interface/http/routes/userRoutes.ts
import { Router } from "express";
<<<<<<< HEAD
import { createUserController } from "../controllers/CreateUserController";
import { cancelUserController } from "../controllers/CancelUserController";
import { updateUserController } from "../controllers/UpdateUserController";

const router = Router();

router.post("/users", createUserController.execute as any);
router.delete("/users/:id", cancelUserController.execute as any);
router.put("/users/:id", updateUserController.execute as any);
=======
import { createUserController, findAllUsersController } from "../controllers/CreateUserController";
import { cancelUserController } from "../controllers/CancelUserController";
import { UpdateUserController } from "../controllers/UpdateUserController";

const router = Router();

router.post("/users", createUserController);
router.get("/users", findAllUsersController);
router.delete("/users/:id", cancelUserController);
router.put("/users/:id", UpdateUserController);

>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21

export default router;
