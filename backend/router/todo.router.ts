import express from 'express'
import { TodoEntity } from '../entities/todo.entity'
import { AppDataSource } from '../datasource'
import { ILike } from 'typeorm'

export const TodoRouter = express.Router()

const TodoTable = AppDataSource.getRepository(TodoEntity)

TodoRouter.post('/create-todo', async(req,res)=>{
    const payload = req.body
    try{
        const todo = await TodoTable.create(payload)
        await TodoTable.save(todo)
        res.status(201).send({'message':'task created successfully'})
    }catch(err){
        res.status(400).send({'error':'error in creating todo'})
    }
})

TodoRouter.get('/get-todos',async(req,res)=>{
     const page = req.query.page || 1
     const limit = req.query.limit || 10
     const skip = (Number(page) -1) * Number(limit)
     const searchtodo = req.query.searchtodo || ""
    try{
        const todos = await TodoTable.find({
            where:searchtodo ? { title: ILike(`%${searchtodo}%`) } : {} ,
            skip:skip,
            take: Number(limit)
        })
        res.status(200).send({"message":"all todos fetched successfully","todos":todos})
    }catch(err){
        res.status(400).send({'error':'error in fetching todos'})
    }
})

TodoRouter.get('/get-todo/:id',async(req,res)=>{
    
   try{
       const todo = await TodoTable.findOneBy({id:req.params.id})
       if(!todo){
              return res.status(404).send({'error':'todo not found'})
         }
       res.status(200).send({"message":"Task fetched successfully","todo":todo})
   }catch(err){
       res.status(400).send({'error':'error in fetching task'})
   }
})


TodoRouter.put('/update-doto/:id',(req,res)=>{
    try{
        res.send({'message':'update todo'})
    }catch(err){
        console.log(err)
        res.status(400).send({'error':'error in updating todo'})
    }
})

