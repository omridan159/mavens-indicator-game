const cron = require('node-cron');
import dotenv from 'dotenv';
import { connectToDatabase } from './db/connect';

const resultDotenv = dotenv.config({});

if (resultDotenv.error) {
   throw resultDotenv.error;
}
