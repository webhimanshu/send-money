import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: "firstName", type: 'varchar', length: 100})
    firstName!: string;

    @Column({ name: "lastName", type: 'varchar', length: 100})
    lastName!: string;

    @Index({ unique: true })
    @Column({ name: "email", type: 'varchar', length: 255})
    email!: string;

    @Column({ name: "password", type: 'varchar', length: 255})
    password!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: string;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: string;
}