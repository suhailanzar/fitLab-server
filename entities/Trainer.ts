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
        public readonly userid: string | null,
        public readonly username: string | null,
        public readonly date: string,
        public readonly startTime: string,
        public readonly price: number,
        public readonly status: boolean,
        public readonly id :string
        
    ){

    }
}


export class IModule {
    constructor(

        public readonly name: string,
        public readonly description: string,
        public readonly videoUrl: string,
){

}
}


export class ICourse {
    constructor(
        public readonly author: string,
        public readonly courseName: string,
        public readonly description: string,
        public readonly modules: IModule[],
        public readonly price: number,
        public readonly trainerId: ObjectId,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
){

}
}