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
    // orgin: 'http://localhost:4200/',
    orgin: 'https://fitlab-phi.vercel.app/',
    optionsSuccessStatus: 200,
    credentials: true 
}

app.use(express.json({limit: '50mb'}));
app.use(cors(corsoptions))
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));



export default app;