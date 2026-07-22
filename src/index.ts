import express from 'express';
import cors from 'cors';
import { connect } from './db.js';
import signupRouter from './routes/signup.js';
import signinRouter from './routes/signin.js';
import contentRouter from './routes/content.js';
import shareableLinkRouter from './routes/sharableLink.js';
import brainRouter from './routes/brain.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', signupRouter); // Allows POST /api/v1/signup
app.use('/api/v1', signinRouter); // Allows POST /api/v1/signin
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/shareable-link', shareableLinkRouter);
app.use('/api/v1/brain', brainRouter);

connect();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


