import { Payment, User } from "../entities/user";
export interface IuserInteractor {
  findUser(email: string): Promise<User | null>;
  signup( username: string, email: string, password: string, isblocked: boolean ): Promise<User | null>;
  checkpass(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: User): Promise<string>;
  sendmail(email: string): Promise<string>;
  otpcheck(value: number,email:string): Promise<{isValid:boolean,isExpired:boolean}>;
  refreshToken(payload: User):Promise<string>
  RegisterUser(datas:User):Promise<User | null>
  userLogin(email: string): Promise<string>;
  getTrainer(): Promise<Array<any>>
  searchTrainer(query: string | RegExp): Promise<Array<any>>
  savepayment(datas:Payment): Promise<Array<any>>
  getMessages(data: any): Promise<Array<any> | string> 


}