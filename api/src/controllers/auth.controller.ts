import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const signUpHandler = async (req: Request, resp: Response) => {
  try {
    const payload = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    const user = await authService.signup(payload);
    return resp.status(201).json({ success: true, data: user });
  } catch (err: any) {
    if (err.code === "EMAIL_EXISTS") {
      return resp.status(409).json({ success: false, message: err.message });
    } else {
      return resp
        .status(400)
        .json({ success: false, message: err.message || "Signup failed" });
    }
  }
};

export const loginHandler = async (req: Request, resp: Response) => {
    try {
      const payload = req.body as {
        email: string;
        password: string;
      }
      const user = await authService.login(payload);
      return resp.status(201).json({ success: true, data: user })
    } catch (error: any) {
      if(error.code === "INCORRECT_PAYLOAD"){
        return resp.status(401).json({ success: false, message: error.message })
      }
      return resp.status(400).json({ success: false, message: error.message })
    }
}