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
