import { ObjectId } from "mongoose";

export class User {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly isblocked:boolean,
        public readonly id?:string,
        public readonly place?:string,
        public readonly age?:number,
        public readonly gender?:string,
        public readonly weight?:number,
        public readonly height?:number,
        public readonly image?:string,
        public readonly createdat?:Date,


    ) {}
}




export class Payment {
    constructor(
        public readonly  razorpayPaymentId:string,
        public readonly   amount:number,
        public readonly currency:string,
        public readonly   userid:string,
        public readonly   slotid:string,
        public readonly   trainerid:string

    ) {}
}

export class coursePayment {
    constructor(
      public readonly razorpayPaymentId: string,
      public readonly amount: number,
      public readonly currency: string,
      public readonly courseId: string,
      public readonly courseName: string,
      public readonly   trainerId:string

    ) {}
  }



  export class enrolledModule {
    constructor(
      public readonly moduleId: string,
      public readonly completed: boolean = false
    ) {}
  }
  
  export class enrolledCourse {
    constructor(
      public readonly userId: ObjectId,
      public readonly courseId: string,
      public readonly enrolledAt: Date = new Date(),
      public readonly completed: boolean = false,
      public readonly modules: enrolledModule[],
      public readonly createdAt: Date = new Date(),
      public readonly updatedAt: Date = new Date()
    ) {}
  }
  
