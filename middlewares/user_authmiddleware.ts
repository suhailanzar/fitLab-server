import { Request,Response } from 'express';
import jwt, { VerifyErrors, Secret } from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

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
    
    const authHeader = req.headers['authorization-user'];  
    
    

    if (typeof authHeader !== 'string') {

        return res.sendStatus(401); 
    }

    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) {
        return res.sendStatus(401); // If there's no token, return 401 (Unauthorized)
    }

    const secret: Secret = process.env.SECRET_LOGIN as string;

    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: User | any) => {
        
        if (err) {
            return res.sendStatus(403);
        } else {
            const user = await UserModel.find({ _id: decoded._id });
            if(user) {
                req.user_id = decoded.id;
                next();
            } else {
                return res.sendStatus(401);
            }
        }
    });
};

export default authenticateTrainerToken;