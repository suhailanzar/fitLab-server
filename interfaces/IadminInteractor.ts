import { Trainer } from "../entities/Trainer";
import { Meal } from "../entities/admin";

export interface IadminInteractor {
  
  adminLogin(email: string , pass:string): Promise<boolean>;
  get_requests(): Promise<Array<Trainer>>
  getTrainers(): Promise<Array<Trainer>>
  trainerapproval(id:string): Promise<boolean  | null>
  trainerDetails(id:string): Promise<Array<Trainer>>
  addmeal(meals:Meal): Promise<string | null>
  getMeals(): Promise<any>


}