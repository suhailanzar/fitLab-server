import { Slot, Trainer } from "../entities/Trainer";

export interface ItrainerInteractor {
  findtrainer(email: string): Promise<Trainer | null>;
  checkpass(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: Trainer): Promise<string>;
  sendmail(email: string): Promise<string>;
  otpcheck(value: number,email:string): Promise<{isValid:boolean,isExpired:boolean}>;
  refreshToken(payload: Trainer):Promise<string>
  Registertrainer(datas:Trainer):Promise<Trainer | null>
  trainerLogin(email: string): Promise<string>;
  editProfileTrainer(data:Trainer, id:string,image:Express.Multer.File): Promise<string>;
  getprofile( id:string): Promise<Trainer | null>;
  addslot( id:string , slot:Slot): Promise< string | null>;
  getslots( id:string): Promise<Trainer | null>;


}