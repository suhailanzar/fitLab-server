import { Trainer } from "../entities/Trainer";
import { Payment, User } from "../entities/user";
export interface IuserRepository {
  findUser(email: string): Promise<User | null>;
  refreshToken(payload: User): Promise<string>;
  passwordmatch(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: User): Promise<string>;
  sendmail(email: string): Promise<string>;
  otpchecked(value: number, email: string): Promise<{ isValid: boolean, isExpired: boolean }>;
  RegisterUser(datas: User): Promise<User | null>
  userLogin(email: string): Promise<string>;
  getTrainers(): Promise<Array<Trainer>>
  searchTrainer(query: string | RegExp): Promise<Array<any>>
  savepayment(datas:Payment): Promise<Array<any>>



}
