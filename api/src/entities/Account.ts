import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn, ValueTransformer } from "typeorm";
import { User } from "./User";

const numericToNumber: ValueTransformer = {
  to: (value?: number) => (value === undefined ? null : value),
  from: (value: string | null) => (value === null ? 0 : Number(value)),
}

@Entity()
export class Account {
    @PrimaryColumn("uuid")
    userId!: string;

    @OneToOne(()=> User, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId'})
    user!: User;

    @Column({ name: 'balance', type: 'numeric', precision: 18, scale: 2, default: "10000.00", transformer: numericToNumber})
    balance!: number; 

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}