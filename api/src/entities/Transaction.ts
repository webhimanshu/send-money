import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export enum TransactionStatus {
    COMPLETED = "completed",
    FAILED = "FAILED"
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(()=> User)
    @JoinColumn({ name: "from_user_id"})
    fromUser!: User | null;

    @ManyToOne(()=> User)
    @JoinColumn({ name: "to_user_id" })
    toUser!: User | null;

    @Column({ type: "bigint" })
    amount!: string;

    @Column({ type: "varchar", length: 32 })
    type!: TransactionType; 

    @Column({ type: "varchar", length: 16, default: "completed"})
    status!: TransactionStatus;

    @CreateDateColumn()
    createdAt!: Date;
}