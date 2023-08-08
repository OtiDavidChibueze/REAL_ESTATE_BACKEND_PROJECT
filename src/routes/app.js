// Real Estate Application File
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

// activate express
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(helmet());

// Routes
import User_Routes from './user.js';
import Property_Routes from './property.js';


app.use('/api/v1/property', Property_Routes)
app.use('/api/v1/user', User_Routes)

// export the application
export default app;


