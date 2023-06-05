import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({});

let db: mongoose.Connection | null = null;

export const connectToDatabase = () => {
   if (db) {
      return db;
   }

   mongoose.connect(process.env.MONGO_DB_URI);

   db = mongoose.connection;

   const reconnect = () => {
      mongoose.connect(process.env.MONGO_DB_URI);
   };

   db.on('connected', () => {
      console.log('Mongoose connection opened 📗');
   });

   db.on('error', (err: unknown) => {
      console.error(`Mongoose connection error: ${err}`);
      console.log('Trying to reconnect in 5s...');
      setTimeout(reconnect, 5000);
   });

   db.on('disconnected', () => {
      console.log('🛑 Mongoose default connection disconnected');
      console.log('Trying to reconnect in 5s...');
      setTimeout(reconnect, 5000);
   });

   // If the Node process ends, close the Mongoose connection
   process.on('SIGINT', () => {
      db?.close();

      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
   });

   return db;
};
