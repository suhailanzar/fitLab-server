import express from  'express';
import cors from  'cors';
import Session  from 'express-session';
import path from 'path';


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

app.use(express.json({limit: '50mb'}));
app.use(cors(corsoptions))
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



export default app;