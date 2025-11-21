import express from 'express';
import { validateDto } from '../middleware/validateDto.middleware';
import { LoginDto, SignupDto } from '../dtos/auth.dto';
import { loginHandler, signUpHandler } from '../controllers/auth.controller';

const router = express.Router();

router.post("/signup", validateDto(SignupDto), signUpHandler);

router.post("/login", validateDto(LoginDto), loginHandler);

router.get("/me", (req, resp)=>{
  resp.json({msg: "request"})
});

export default router;