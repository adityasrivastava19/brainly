import express from 'express';
import { connect } from './db.js';
import signupRouter from './routes/signup.js';
import signinRouter from './routes/signin.js';
import contentRouter from './routes/content.js';
import deleteRouter from './routes/deleteContent.js';
import  allContentRoute from "./routes/gelAllContnt.js"

const app = express();

app.use(express.json());

app.use('/api/v1', signupRouter); // Allows POST /api/v1/signup

app.use('/api/v1', signinRouter); // Allows POST /api/v1/signin

app.use('/api/v1/content', contentRouter);

app.use('/api/v1', deleteRouter);

app.use('/api/v1/contentAll',allContentRoute);

connect();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
