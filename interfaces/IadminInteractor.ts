import { Trainer } from "../entities/Trainer";

export interface IadminInteractor {
  
  adminLogin(email: string , pass:string): Promise<boolean>;
  get_requests(): Promise<Array<Trainer>>
  getTrainers(): Promise<Array<Trainer>>
  trainerapproval(id:string): Promise<Array<Trainer>>
  trainerDetails(id:string): Promise<Array<Trainer>>


}