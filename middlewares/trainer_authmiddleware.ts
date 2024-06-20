import { Request,Response } from 'express';
import jwt, { VerifyErrors, Secret } from 'jsonwebtoken';
import { trainerModel } from '../models/trainerModel';

interface User {
    _id: string;
}

// Extend the Express request interface
declare global {
    namespace Express {
        interface Request {
            user_id?: string;
        }
    }
}

const authenticateTrainerToken = (req: Request, res: Response, next: any) => {
    
    const authHeader = req.headers['authorization-trainer'];  
    
    

    if (typeof authHeader !== 'string') {

        return res.sendStatus(401); 
    }

    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) {
        return res.sendStatus(401); 
    }

    const secret: Secret = process.env.SECRET_LOGIN as string;

    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: User | any) => {
        
        if (err) {
            return res.sendStatus(403);
        } else {
            const trainer = await trainerModel.find({ _id: decoded._id});
            
            console.log('middleware jwt',decoded);
            
            if(trainer) {
                req.user_id = decoded._id;                
                next();
            } else {
                return res.sendStatus(401);
            }
        }
    });
};

export default authenticateTrainerToken;