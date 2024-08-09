import { ObjectId } from "mongoose";
import { ICourse, IPayment, Slot, Trainer } from "../entities/Trainer";
import { User } from "../entities/user";

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
  addSlots(id: string, slots: Slot[]): Promise<Slot[] | string>;
  getslots( id:string): Promise<Trainer | null>;
  getclients(): Promise<Array<User> | null>;
  getbookings(trainerid:string): Promise<Array<Slot> | string>;
  editSlot(trainerid:string,slotid:string,data:Slot): Promise<Slot | null>;
  addCourse(CourseDetails:ICourse): Promise<string | null>;
  getCourses(trainerid:ObjectId): Promise<Array<ICourse> | null>;
  revenueData(trainerId: string): Promise<Array<IPayment> | null> 
  getMessagesTrainer(data: any): Promise<Array<any> | string> 
  deleteSlot(slotId:string,trainerId:string):Promise<string | null>


}