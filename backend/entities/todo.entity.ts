import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TaskState {
    NOTSTARTED = 'not_started',
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

    @Column({ type: 'varchar'})
    description: String

    @Column({
        type: 'enum',
        enum: TaskState,
        default: TaskState.NOTSTARTED,
      })
    task_state: TaskState;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}