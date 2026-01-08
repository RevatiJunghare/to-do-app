import express from 'express';
import { AppDataSource } from './datasource';
import cors from 'cors';
import { UserRouter } from './router/user.router';
import { authMiddleware } from './middleware/auth.middleware';
import { TodoRouter } from './router/todo.router';
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user',UserRouter)

 app.use(authMiddleware)
app.use("/todo",TodoRouter)

AppDataSource.initialize().then(()=>{
    console.log('server is connected to database')
    app.listen(8083,()=>{
        try{
         console.log('server is running on port 8083')
        }catch(err){
         console.log('server is not running',err)
        }
     })
}).catch((err)=>{
    console.log('error during connecting to database',err)
})

