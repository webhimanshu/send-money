import { Router } from "express";
import { transferHandler } from "../controllers/transfer.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validateDto.middleware";
import { TransferDto } from "../dtos/transfer.dto";

const router = Router();

router.post("/", authMiddleware, validateDto(TransferDto),  transferHandler)

export default router;