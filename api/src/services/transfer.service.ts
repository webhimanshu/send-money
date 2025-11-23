import { AppDataSource } from "../data-source";
import { Account } from "../entities/Account";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../entities/Transaction";
import { User } from "../entities/User";

export class TransferService {
  async transferMoney(fromUserId: string, toUserId: string, amount: string) {
    if (fromUserId === toUserId) throw new Error("Cannot transfer to self");
    if (!/^\d+$/.test(amount)) throw new Error("Invalid amount");

    const amt = BigInt(amount);
    if (amt <= 0n) throw new Error("Amount must be > 0");

    const query = AppDataSource.createQueryRunner();
    await query.connect();
    await query.startTransaction();

    try {
      const order = [fromUserId, toUserId].sort();
      const accounts = await Promise.all(
        order.map((id) =>
          query.manager.findOne(Account, {
            where: { userId: id },
            lock: { mode: "pessimistic_write" },
          })
        )
      );
      const senderAcc = accounts[order.indexOf(fromUserId)];
      const receiverAcc = accounts[order.indexOf(toUserId)];

      if (!senderAcc) throw new Error("Sender account not found");
      if (!receiverAcc) throw new Error("Receiver account not found");

      const senderBal = BigInt(senderAcc.balance);
      const receiverBal = BigInt(receiverAcc.balance);

      if (senderBal < amt) throw new Error("Insufficient balance");

      const newSender = senderBal - amt;
      const newReceiver = receiverBal + amt;

      await query.manager.update(
        Account,
        { userId: fromUserId },
        { balance: Number(newSender) }
      );
      await query.manager.update(
        Account,
        { userId: toUserId },
        { balance: Number(newReceiver) }
      );

      const fromUser = await query.manager.findOne(User, {
        where: { id: fromUserId },
      });
      const toUser = await query.manager.findOne(User, {
        where: { id: toUserId },
      });

      const tx = query.manager.create(Transaction, {
        fromUser,
        toUser,
        amount: amount.toString(),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
      });

      await query.manager.save(tx);
      await query.commitTransaction();

      return { transactionId: tx.id };
    } catch (error) {
      await query.rollbackTransaction();
      throw error;
    } finally {
      await query.release();
    }
  }
}
