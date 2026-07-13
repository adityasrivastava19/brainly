import express from 'express';
import { connect } from './db.js';
const app = express();

app.use(express.json())
connect()
app.listen(3000,()=>{
  
})











app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
