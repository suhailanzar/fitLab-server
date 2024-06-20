import express from  'express';
import cors from  'cors';
import bodyparser from 'body-parser'
import Session  from 'express-session';


const app = express();


app.use(Session({
    secret: 'session123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } 
  }));

const corsoptions = {
    orgin: 'http://localhost:4200/',
    optionsSuccessStatus: 200,
    credentials: true 
}

app.use(express.json());
app.use(cors(corsoptions))
app.use(express.urlencoded({ extended: true }));


export default app;