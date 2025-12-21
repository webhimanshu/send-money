import { Repository } from "typeorm";
import { Account } from "../entities/Account";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UserService {
  private accountRepo: Repository<Account>;
  private userRepo: Repository<User>;

  constructor() {
    this.accountRepo = AppDataSource.getRepository(Account);
    this.userRepo = AppDataSource.getRepository(User);
  }

  async getBalance(userId: string) {
    const account = await this.accountRepo.findOne({
      where: { userId },
    });

    if (!account) {
      return new Error("Account not found");
    }
    return account.balance;
  }

  async getAllUsers(excludeUserId?: string) {
    const users = await this.userRepo.find({
      select: ["id", "firstName", "lastName", "email"],
    });
    const results = users
      .filter((item) => item.id !== excludeUserId)
      .map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
      }));
    return results;
  }

  async searchUsers(searchQuery: string, excludeUserId?: string) {
    if (!searchQuery || searchQuery.trim() === "") {
      return this.getAllUsers(excludeUserId);
    }

    const searchTerm = `%${searchQuery}%`;
    const users = await this.userRepo
      .createQueryBuilder("user")
      .select(["user.id", "user.firstName", "user.lastName", "user.email"])
      .where("user.firstName LIKE :search", { search: searchTerm })
      .orWhere("user.lastName LIKE :search", { search: searchTerm })
      .orWhere("user.email LIKE :search", { search: searchTerm })
      .getMany();

    const results = users
      .filter((item) => item.id !== excludeUserId)
      .map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
      }));
    return results;
  }
}
