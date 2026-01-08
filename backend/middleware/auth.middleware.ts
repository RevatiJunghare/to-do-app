import * as jwt from 'jsonwebtoken'
export const authMiddleware = (req:any, res:any, next:any)=>{
    const token = req.headers.authorization
  try{
      jwt.verify(token, 'secret', (err:any, decoded:any)=> {
        if(err){
            console.log('token missing',err)
            res.status(401).send({'error':'error in decoding token'})
        }
        req.decodedToken = decoded

         console.log(decoded) 
        next()
      });
  }catch(err:any){
    res.status(500).send({'error':err.message})
  }
}