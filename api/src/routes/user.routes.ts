import { Router } from "express";
import { fetchAllUsers, fetchUser, getBalance } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/balance', authMiddleware, getBalance);

router.get('/', authMiddleware, fetchAllUsers);

router.get('/paginated', authMiddleware, fetchUser);

export default router;