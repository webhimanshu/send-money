import { Request, Response } from "express";
import { TransferService } from "../services/transfer.service";

const transferService = new TransferService();
export const transferHandler = async (req: Request, resp: Response) => {
  try {
    const authReq: any = req;
    const fromUserId = authReq.user.userId;
    if (!fromUserId)
      return resp
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const { toUserId, amount } = req.body;
    const result = await transferService.transferMoney(
      fromUserId,
      toUserId,
      amount
    );
    return resp.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return resp.status(400).json({ success: false, message: error.message });
  }
};
