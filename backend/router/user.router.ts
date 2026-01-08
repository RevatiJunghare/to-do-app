import express from 'express'
import { AppDataSource } from '../datasource'
import bcrypt from 'bcrypt'
import * as jwt from "jsonwebtoken";
import { UserEntity } from '../entities/user.entity';

export const UserRouter = express.Router()

const UserTable = AppDataSource.getRepository(UserEntity)

UserRouter.post('/register',async(req,res)=>{
    const payload = req.body
   try{
    const IsUser = await UserTable.findOneBy({email:payload.email})
    if(IsUser){
        return res.status(409).send({'error':'User already exists'})
    }
    bcrypt.hash(payload.password, 5, async(err:any, hash:any)=> {
        // Store hash in your password DB.
        if(err){
            res.status(400).send({'error':'error while hashing password'})
        }
        payload.password = hash
        const user = UserTable.create(payload)
        await UserTable.save(user)
        res.send({'message':'User registered Successfully'})
    });

    
   }catch(err){
     console.log(err)
     res.status(400).send({'error':'User is not registered'})
   }
})


UserRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body
    try{
        const IsUser = await UserTable.findOneBy({email:email})
        if(!IsUser){
            return res.status(401).send({'error':'Invalid Email'})
        }
        // Load hash from your password DB.
        bcrypt.compare(password, IsUser.password, async(err:any, result:any)=> {
          // result == true
          if(err){
            return res.status(401).send({'error':'Invalid Password'})
          }
          if(!result){
            return res.status(500).send({'error':'Invalid Credentials'})
          }
        
          const token = jwt.sign({data: IsUser}, 'secret', { expiresIn: '42h' });
           return res.status(200).send({'message':'Login successful','token':token})
        
        });
        
    }catch(err){
        console.log('login error',err)
        res.status(400).send({'error':'Login Failed'})
    }
})