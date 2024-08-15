import { Trainer } from "../entities/Trainer";
import { Meal } from "../entities/admin";
import { Reports, User } from "../entities/user";

export interface IadminRepository {
  
  adminLogin(email: string , pass:string): Promise<boolean>;
  get_requests(): Promise<Array<Trainer>>
  getTrainers(): Promise<Array<Trainer>>
  getUsers(): Promise<Array<User> |null>
  trainerapproval(id:string): Promise<boolean  | null>
  blockTrainer(id:string): Promise<string  | null>
  blockUser(id:string): Promise<string  | null>
  trainerDetails(id:string): Promise<Array<Trainer>>
  userDetails(id:string): Promise<User | null>
  addmeal(meals:Meal): Promise<string | null>
  getMeals(): Promise<any>
  getReports(): Promise<Reports[] | null>
  findUser(id: string,reportId:string): Promise<User | null>;

}
