import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Account } from "../entities/Account";

const JWT_SECRET = process.env.JWT_SECRET || "jhagdas98";
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export class AuthService {
  private userRepo: Repository<User>;
  private account: Repository<Account>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.account = AppDataSource.getRepository(Account);
  }

  async signup(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const { firstName, lastName, email, password } = payload;

    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      const err: any = new Error("Email already registered");
      err.code = "EMAIL_EXISTS";
      throw err;
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await queryRunner.manager.save(user);

      const account = queryRunner.manager.create(Account, {
        userId: user.id,
        balance: 7000,
      });
      await queryRunner.manager.save(account);
      await queryRunner.commitTransaction();

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        balance: account.balance
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
    finally{
      await queryRunner.release();
    }
  }

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      const err: any = new Error("Email or password is incorrect");
      err.code = "INCORRECT_PAYLOAD";
      throw err;
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      const err: any = new Error("Email or password is incorrect");
      err.code = "INCORRECT_PAYLOAD";
      throw err;
    }

    const token = await jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      id: user.id,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
