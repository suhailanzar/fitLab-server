import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, Secret } from 'jsonwebtoken';
import { trainerModel } from '../models/trainerModel';

interface User {
    _id: string;
}

declare global {
    namespace Express {
        interface Request {
            user_id?: string;
        }
    }
}

const authenticateTrainerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('entered the authenticate token trianer');
        
        const authHeader = req.headers['authorization-trainer'];
        
        if (typeof authHeader !== 'string') {
            return res.status(401).json({ message: "No authorization header" });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const secret: Secret = process.env.SECRET_LOGIN as string;

        jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: User | any) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token " });
            }

            const trainer = await trainerModel.findById(decoded._id);
            
            if (trainer) {
                req.user_id = decoded._id;
                next();
            } else {
                console.log('no trainer tokens');
                
                return res.status(401).json({ message: "Trainer not found" });
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default authenticateTrainerToken;