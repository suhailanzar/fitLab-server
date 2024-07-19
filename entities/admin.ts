export class Admin {
    constructor(
     
    ) {}
}


export class Meal {
    constructor(
      public readonly type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
      public readonly category: 'Veg' | 'Non-veg',
      public readonly name: string,
      public readonly image: string,
      public readonly description: string,
      public readonly calories: number,
      public readonly protein: number,
      public readonly fats: number,
      public readonly date: Date,
      public readonly _id?: string,
    ) {}
  }