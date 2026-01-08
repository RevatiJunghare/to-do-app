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

TodoRouter.get('/get-todos', async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const searchtodo = String(req.query.searchtodo || "");
  
      const [todos, total] = await TodoTable.findAndCount({
        where: searchtodo
          ? { title: ILike(`%${searchtodo}%`) }
          : {},
        skip,
        take: limit,
        order: {
          createdAt: "DESC",
        },
      });
  
      res.status(200).send({
        message: "all todos fetched successfully",
        todos,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "error in fetching todos" });
    }
  });
  

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


TodoRouter.put('/update-todo/:id',async(req,res)=>{
    const payload = req.body
    const ID = req.params.id
    console.log("todo updated",payload)
    try{
        const todo = await TodoTable.findOneBy({id:ID})
        if(!todo){
            return res.status(404).send({'error':'todo not found'})
        }
        await TodoTable.update({id:req.params.id},payload)
        res.send({'message':'update todo'})
    }catch(err){
        console.log(err)
        res.status(400).send({'error':'error in updating todo'})
    }
})

TodoRouter.delete('/delete-todo/:id',async(req,res)=>{
    try{
        const todo = await TodoTable.findOneBy({id:req.params.id})
        if(!todo){
            return res.status(404).send({'error':'todo not found'})
        }
        await TodoTable.delete({id:req.params.id})
        res.send({'message':'todo deleted successfully'})
    }catch(err){
        res.status(400).send({'error':'error in deleting todo'})
    }
})

