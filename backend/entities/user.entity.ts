import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    user_id: string

    @Column({ type: 'varchar'})
    username: string

    @Column({ type: 'varchar'})
    email: string

    @Column({ type: 'varchar'})
    password: string

    @CreateDateColumn({ type: 'date'})
    created_at: Date

    @UpdateDateColumn({ type : 'date'})
    updated_at: Date
}