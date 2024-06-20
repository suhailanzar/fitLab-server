import jwt from 'jsonwebtoken';
import { User } from '../entities/user';

export const generateJWT = (user: User): string => {
  return jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
