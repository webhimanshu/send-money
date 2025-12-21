import { Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth.middleware";

const userService = new UserService();
export const getBalance = async (req: AuthRequest, resp: Response) => {
  try {
    const authReq: any = req;
    const userId = authReq.user.userId;

    if (!userId) {
      return resp
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const result = await userService.getBalance(userId);
    return resp.status(200).json({ success: true, balance: result });
  } catch (error: any) {
    return resp.status(400).json({ success: false, message: error.message });
  }
};

export const fetchAllUsers = async (req: AuthRequest, resp: Response) => {
  try {
    const authReq: any = req;
    const userId = authReq.user.userId;

    if (!userId) {
      return resp
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    
    const result = search 
      ? await userService.searchUsers(search, userId)
      : await userService.getAllUsers(userId);
    
    return resp.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return resp.status(400).json({ success: false, message: error.message });
  }
};

export const fetchUser = async (req: AuthRequest, resp: Response)=>{}
