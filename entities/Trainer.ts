import { ObjectId } from "mongoose";

export class Trainer {
    constructor(
        public readonly trainername: string,
        public readonly email: string,
        public readonly password: string,
        public readonly isblocked:boolean,
        public readonly isapproved:boolean, 
        public readonly availibilty?:boolean, 
        public readonly availableslots?:Slot[], 
        public readonly image?:string, 
        public readonly phone?:number, 
        public readonly specification?:string, 
        public readonly _id?:string, 



    ) {}
}


export class Slot{
    constructor(
        public readonly date: string,
        public readonly startTime: string,
        public readonly endTime: string,
        public readonly price: number,
        public readonly status: boolean,
        public readonly id :string,
        public readonly userid?: string | null,
        public readonly username?: string | null,
        
    ){

    }
}


export class IModule {
    constructor(

        public readonly name: string,
        public readonly description: string,
        public readonly videoUrl: string,
        public readonly id: string,
){

}
}


export class ICourse {
    constructor(
        public readonly author: string,
        public readonly courseName: string,
        public readonly description: string,
        public readonly thumbnail: string,
        public readonly modules: IModule[],
        public readonly Price: number,
        public readonly trainerId: ObjectId,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly id :string

){
}
}

export class IPayment  {
  
    constructor(

        public readonly transactionId: string,
        public readonly userId:ObjectId,
        public readonly amount: number,
        public readonly currency: string,
        public readonly paymentMethod: string,
        public readonly paymentType: 'slotBooking' | 'coursePurchase',
        public readonly paymentDate: Date,
        public readonly createdAt: Date,
        public readonly trainerId?:ObjectId,
        public readonly slotId?:ObjectId,
        public readonly courseId?:ObjectId,
        public readonly id?:ObjectId

      
    ) {
    }
  }


