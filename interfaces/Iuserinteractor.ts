import { coursePayment, Payment, Reports, User } from "../entities/user";
import { ICourse } from "../entities/Trainer";
import { Meal } from "../entities/admin";
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
  bookslot(datas:Payment): Promise<Array<any>>
  getMessages(data: any): Promise<Array<any> | string> 
  editprofile(data:User, id:string,image:any): Promise<User | null> 
  getuserprofile(id: string): Promise<User | null>;
  subscribe(datas:any,userid:string): Promise<Array<any>>
  getCourse(page:number,limit:number): Promise<any>
  getCoursedetails(id:string): Promise<ICourse | null>
  saveCourse(paymentDetails: coursePayment, userId: string): Promise<string | null>
  getPurchasedCourses(userId:string):Promise<{Enrolled:any,courses:any}> 
  updateModuleCompletion (moduleId:string,courseId:string, complete:boolean ):Promise<string | null> 
  submitReport(data:Reports):Promise<string | null>
  saveMeal(userId:string,name:string,meals:Meal[]):Promise<string | null>
  getReportsUser(userId:string): Promise<Reports[] | null>



  


}