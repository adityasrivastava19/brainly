import express from 'express';
import { connect } from './db.js';
import signupRouter from './routes/signup.js';
import signinRouter from './routes/signin.js';
import contentRouter from './routes/content.js';
import deleteRouter from './routes/deleteContent.js';

const app = express();

app.use(express.json());

// Mount the signup router
app.use('/api/v1', signupRouter); // Allows POST /api/v1/signup

// Mount the signin router
app.use('/api/v1', signinRouter); // Allows POST /api/v1/signin

// Mount content endpoints
app.use('/api/v1/content', contentRouter);

// Mount delete endpoints
app.use('/api/v1', deleteRouter);

connect();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
