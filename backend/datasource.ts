import { DataSource } from "typeorm";
import { TodoEntity } from "./entities/todo.entity";
import { UserEntity } from "./entities/user.entity";
import 'dotenv/config'

export const AppDataSource = new DataSource({
    type:'postgres',
    host:'localhost',
    port: Number(process.env.PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [TodoEntity,UserEntity],
    synchronize:true
})