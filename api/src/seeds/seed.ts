import "reflect-metadata";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { Account } from "../entities/Account";

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const FAKE_USERS = [
  {
    firstName: "Aarav",
    lastName: "Patel",
    email: "aarav.patel@example.com",
  },
  {
    firstName: "Vihaan",
    lastName: "Sharma",
    email: "vihaan.sharma@example.com",
  },
  {
    firstName: "Aditya",
    lastName: "Verma",
    email: "aditya.verma@example.com",
  },
  {
    firstName: "Vivaan",
    lastName: "Singh",
    email: "vivaan.singh@example.com",
  },
  {
    firstName: "Arjun",
    lastName: "Reddy",
    email: "arjun.reddy@example.com",
  },
  {
    firstName: "Reyansh",
    lastName: "Iyer",
    email: "reyansh.iyer@example.com",
  },
  {
    firstName: "Mohammed",
    lastName: "Ali",
    email: "mohammed.ali@example.com",
  },
  {
    firstName: "Sai",
    lastName: "Kumar",
    email: "sai.kumar@example.com",
  },
  {
    firstName: "Krishna",
    lastName: "Menon",
    email: "krishna.menon@example.com",
  },
  {
    firstName: "Ishaan",
    lastName: "Gupta",
    email: "ishaan.gupta@example.com",
  },
  {
    firstName: "Kabir",
    lastName: "Chatterjee",
    email: "kabir.chatterjee@example.com",
  },
  {
    firstName: "Rudra",
    lastName: "Nair",
    email: "rudra.nair@example.com",
  },
  {
    firstName: "Ayaan",
    lastName: "Mishra",
    email: "ayaan.mishra@example.com",
  },
  {
    firstName: "Dhruv",
    lastName: "Joshi",
    email: "dhruv.joshi@example.com",
  },
  {
    firstName: "Kabya",
    lastName: "Mukherjee",
    email: "kabya.mukherjee@example.com",
  },
  {
    firstName: "Anaya",
    lastName: "Rao",
    email: "anaya.rao@example.com",
  },
  {
    firstName: "Diya",
    lastName: "Sharma",
    email: "diya.sharma@example.com",
  },
  {
    firstName: "Myra",
    lastName: "Patil",
    email: "myra.patil@example.com",
  },
  {
    firstName: "Aadhya",
    lastName: "Bansal",
    email: "aadhya.bansal@example.com",
  },
  {
    firstName: "Sara",
    lastName: "Kaur",
    email: "sara.kaur@example.com",
  },
  {
    firstName: "Ira",
    lastName: "Nair",
    email: "ira.nair@example.com",
  },
  {
    firstName: "Pari",
    lastName: "Pillai",
    email: "pari.pillai@example.com",
  },
  {
    firstName: "Meera",
    lastName: "Das",
    email: "meera.das@example.com",
  },
  {
    firstName: "Anika",
    lastName: "Jain",
    email: "anika.jain@example.com",
  },
  {
    firstName: "Ishita",
    lastName: "Agarwal",
    email: "ishita.agarwal@example.com",
  },
  {
    firstName: "Tara",
    lastName: "Chopra",
    email: "tara.chopra@example.com",
  },
  {
    firstName: "Riya",
    lastName: "Kapoor",
    email: "riya.kapoor@example.com",
  },
  {
    firstName: "Navya",
    lastName: "Malhotra",
    email: "navya.malhotra@example.com",
  },
  {
    firstName: "Saanvi",
    lastName: "Gupta",
    email: "saanvi.gupta@example.com",
  },
  {
    firstName: "Advika",
    lastName: "Reddy",
    email: "advika.reddy@example.com",
  },
  {
    firstName: "Anvi",
    lastName: "Deshmukh",
    email: "anvi.deshmukh@example.com",
  },
  {
    firstName: "Charvi",
    lastName: "Chauhan",
    email: "charvi.chauhan@example.com",
  },
  {
    firstName: "Prisha",
    lastName: "Mehta",
    email: "prisha.mehta@example.com",
  },
  {
    firstName: "Kiara",
    lastName: "Thakur",
    email: "kiara.thakur@example.com",
  },
  {
    firstName: "Aarohi",
    lastName: "Sharma",
    email: "aarohi.sharma@example.com",
  },
  {
    firstName: "Nisha",
    lastName: "Verma",
    email: "nisha.verma@example.com",
  },
  {
    firstName: "Sneha",
    lastName: "Goswami",
    email: "sneha.goswami@example.com",
  },
  {
    firstName: "Lavanya",
    lastName: "Tripathi",
    email: "lavanya.tripathi@example.com",
  },
  {
    firstName: "Harini",
    lastName: "Iyer",
    email: "harini.iyer@example.com",
  },
  {
    firstName: "Pooja",
    lastName: "Rao",
    email: "pooja.rao@example.com",
  },
  {
    firstName: "Rajesh",
    lastName: "Gupta",
    email: "rajesh.gupta@example.com",
  },
  {
    firstName: "Sunil",
    lastName: "Shah",
    email: "sunil.shah@example.com",
  },
  {
    firstName: "Deepak",
    lastName: "Patel",
    email: "deepak.patel@example.com",
  },
  {
    firstName: "Rakesh",
    lastName: "Verma",
    email: "rakesh.verma@example.com",
  },
  {
    firstName: "Vikas",
    lastName: "Singh",
    email: "vikas.singh@example.com",
  },
  {
    firstName: "Amit",
    lastName: "Mehta",
    email: "amit.mehta@example.com",
  },
  {
    firstName: "Manish",
    lastName: "Chopra",
    email: "manish.chopra@example.com",
  },
  {
    firstName: "Suresh",
    lastName: "Nair",
    email: "suresh.nair@example.com",
  },
  {
    firstName: "Rohan",
    lastName: "Desai",
    email: "rohan.desai@example.com",
  },
  {
    firstName: "Ankit",
    lastName: "Jain",
    email: "ankit.jain@example.com",
  },
];
async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const userRepo = AppDataSource.getRepository(User);
    const accountRepo = AppDataSource.getRepository(Account);
    const existingUser = await userRepo.count();

    if (existingUser > 0) {
      console.log("⚠️ Users already exist, skipping seeding");
      await AppDataSource.destroy();
      return;
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash("password123", salt);

    const queryRunner = await AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const fake_users = FAKE_USERS.map((user) => ({
      ...user,
      password: passwordHash,
    }));

    try {
      const users = queryRunner.manager.create(User, fake_users);
      await queryRunner.manager.save(users);

      const accountInsert = users.map((u) =>
        queryRunner.manager.create(Account, { userId: u.id, balance: 7000 })
      );
      await queryRunner.manager.save(accountInsert);

      await queryRunner.commitTransaction();

      console.log("✅ Seed data inserted successfully");
      await AppDataSource.destroy();
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}
seed();
