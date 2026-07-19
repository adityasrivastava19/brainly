import express from 'express';
import { connect } from './db.js';
import signupRouter from './routes/signup.js';
import signinRouter from './routes/signin.js';
import contentRouter from './routes/content.js';
import deleteRouter from './routes/deleteContent.js';

const app = express();

app.use(express.json());

// Mount the signup router
app.use(signupRouter);          // Allows POST /signup
app.use('/api/v1', signupRouter); // Allows POST /api/v1/signup

// Mount the signin router
app.use(signinRouter);          // Allows POST /signin
app.use('/api/v1', signinRouter); // Allows POST /api/v1/signin

// Mount content endpoints
app.use('/content', contentRouter);
app.use('/api/v1/content', contentRouter);

// Mount delete endpoints
app.use('/content', deleteRouter);
app.use('/api/v1/content', deleteRouter);

connect();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
