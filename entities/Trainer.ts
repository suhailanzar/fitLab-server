export class Trainer {
    constructor(
        public readonly trainername: string,
        public readonly email: string,
        public readonly password: string,
        public readonly isblocked:boolean,
        public readonly isapproved:boolean, 
        public readonly availibilty?:boolean, 
        public readonly availableslots?:string[], 
        public readonly image?:string, 
        public readonly phone?:number, 
        public readonly specification?:string, 
        public readonly _id?:string, 



    ) {}
}