import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import 'express-async-errors';
import logger from 'jet-logger';
import { NodeEnvironments } from './constants';
import HttpStatusCodes from './constants/HttpStatusCodes';
import BaseRouter from './routes/api';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());

if (process.env.NODE_ENV === NodeEnvironments.Dev) {
   app.use(morgan('dev'));
}

app.use('/api', BaseRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
   logger.err(err, true);
   let status = HttpStatusCodes.BAD_REQUEST;

   return res.status(status).json({ error: err.message });
});

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

export default app;
