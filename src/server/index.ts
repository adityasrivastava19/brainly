import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../validation/validate.js';

const app = express();
app.use(express.json)

app.post("/api/v1/signup",(req,res)=>{
 const result=loginSchema.safeParse(req.body);
 if(!result.success)
 {
    return res.status(400).json({
        errors:result.error.flatten,
    })
 }
})











app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
