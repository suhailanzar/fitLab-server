export class User {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly isblocked:boolean,
        public readonly id?:string


    ) {}
}

export class Payment {
    constructor(
        public readonly  razorpayPaymentId:string,
        public readonly   amount:number,
        public readonly currency:string,
        public readonly   email:string,
        public readonly   slotid:string,
        public readonly   trainerid:string

    ) {}
}
