import { Router } from "express";
import { getAllUsers } from "@controllers/user.controller";
import { authenticate } from "@middlewares/auth";

const router = Router();

router.get("/users", authenticate, getAllUsers);

export default router;
