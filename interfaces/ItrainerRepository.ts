import { TreatAsPrimitives } from "mongoose";
import { Slot, Trainer } from "../entities/Trainer";
export interface ItrainerRepository {
  findtrainer(email: string): Promise<Trainer | null>;
  refreshToken(payload: Trainer): Promise<string>;
  passwordmatch(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: Trainer): Promise<string>;
  sendmail(email: string): Promise<string>;
  otpchecked(value: number, email: string): Promise<{ isValid: boolean, isExpired: boolean }>;
  Registertrainer(datas: Trainer): Promise<Trainer | null>
  trainerLogin(email: string): Promise<string>;
  editProfileTrainer(data:Trainer, id:string , image:Express.Multer.File): Promise<string>;
  getprofile( id:string): Promise<Trainer | null>;
  addslot( id:string , slot:Slot): Promise<string | null>;
  getslots( id:string): Promise<Trainer | null>;


}
