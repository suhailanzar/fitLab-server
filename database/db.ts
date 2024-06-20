import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGOCONNECTION;
const dbName = "fitLab";


    export async function connectDatabase() {
        try {
          if(uri){
              await mongoose.connect(uri, {
                dbName, 
              });
              console.log(`Connected to MongoDB database: ${dbName}`);
          }
        } catch (error) {
          console.error('Error connecting to MongoDB:', error);
          process.exit(1); 
        }
      }

