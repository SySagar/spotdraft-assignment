import { Router } from "express";
import { getAllUsers, getSidebarCounts } from "@controllers/user.controller";
import { authenticate } from "@middlewares/auth";

const router = Router();

router.get("/users", authenticate, getAllUsers);
router.get("/sidebar-counts", authenticate, getSidebarCounts);

export default router;
