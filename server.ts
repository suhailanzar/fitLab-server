import app from './app'
import { connectDatabase } from './database/db';
import dotenv from 'dotenv';
import userrouter from './router/userroutes'
import adminrouter from './router/adminroute'
import trainerrouter from './router/trainerroutes'

dotenv.config()
const port = process.env.PORT || 3000;

(async () => {
    try {
      const db = await connectDatabase();
      console.log('Database connection successful');
    } catch (error) {
      console.error('Error connecting to database:', error);
    }
  })();
  


app.use('/',userrouter)
app.use('/admin',adminrouter)
app.use('/trainer',trainerrouter)



app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);    
})
