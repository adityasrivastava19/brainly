import express from 'express';
import { connect } from './db.js';
import signupRouter from './routes/singnup.js';
import signinRouter from './routes/signin.js';
import contentRouter from './routes/content.js';

const app = express();

app.use(express.json());

// Mount the signup router
app.use(signupRouter);          // Allows POST /signup
app.use('/api/v1', signupRouter); // Allows POST /api/v1/signup

// Mount the signin router
app.use(signinRouter);          // Allows POST /signin
app.use('/api/v1', signinRouter); // Allows POST /api/v1/signin

// Mount the content router
app.use(contentRouter);          // Allows POST /content
app.use('/api/v1', contentRouter); // Allows POST /api/v1/content

connect();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
