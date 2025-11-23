import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "jwt_token";

export const authMiddleware = (
  req: AuthRequest,
  resp: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header)
    return resp
      .status(401)
      .json({ success: false, message: "No authorization header" });
  const token = header;

  if (!token)
    return resp
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { userId: decoded.sub || decoded.userId, email: decoded.email };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError")
      return resp
        .status(401)
        .json({ success: false, message: "Token expired" });
    return resp.status(401).json({ success: false, message: "Invalid token" });
  }
};
