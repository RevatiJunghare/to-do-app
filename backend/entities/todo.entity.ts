import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TaskState {
    PENDING = 'pending',
    COMPLETED = 'completed',
    INPROGRESS = 'inprogress',
  }
  

@Entity('todo')
export class TodoEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column({ type: 'varchar'})
    title: String

    @Column({
        type: 'enum',
        enum: TaskState,
        default: TaskState.PENDING,
      })
    task_state: TaskState;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}