import { Request, Response, NextFunction } from 'express';
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

const authenticateUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization-user'];

        if (typeof authHeader !== 'string') {
            return res.status(401).json({ message: "No authorization header" });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const secret: Secret = process.env.SECRET_LOGIN as string;

        jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: any) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            
            if (typeof decoded === 'object' && decoded !== null && '_id' in decoded) {
                const user = await UserModel.findById(decoded._id);
                if (user) {
                    req.user_id = decoded._id;
                    next();
                } else {
                    return res.status(401).json({ message: "User not found" });
                }
            } else {
                return res.status(401).json({ message: "Invalid token payload" });
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default authenticateUserToken;