import { IadminRepository } from "../interfaces/IadminRepository";
import { trainerModel } from "../models/trainerModel";
import dotenv from "dotenv";
import { Meal } from "../entities/admin";
import { Mealmodel } from "../models/meals";


dotenv.config()
const password = process.env.ADMINPASS
const emaill = process.env.ADMINEMAIL


export class adminRepository implements IadminRepository {



   adminLogin = async (email: string, pass: string): Promise<boolean> => {
      console.log('email and password is ', emaill, password);

      if (email !== email || pass !== password) {
         return false
      } else {
         return true
      }

   };

   get_requests = async (): Promise<any> => {
      try {
         const trainers = await trainerModel.find({})
         return trainers
      } catch (error) {
         console.error(error)

      }
   }

   getTrainers = async (): Promise<any> => {
      try {
         const trainers = await trainerModel.find({ isapproved: true })

         return trainers
      } catch (error) {
         console.error(error)

      }
   }


   trainerapproval = async (trainerId: string): Promise<any> => {
      try {
         const trainerDetails = await trainerModel.findById(trainerId)
         console.log('traineris ', trainerDetails);

         if (!trainerDetails) {
            return false
         }
         trainerDetails.isapproved = true;
         return await trainerDetails.save()
      } catch (error) {
         console.error(error)

      }
   }

   trainerDetails = async (trainerId: string): Promise<any> => {
      try {
         const trainerDetails = await trainerModel.findById(trainerId)

         if (!trainerDetails) {
            return false
         }
      } catch (error) {
         console.error(error)

      }
   }

   addmeal = async (meal: Meal): Promise<string | null> => {
      try {
        const newMeal = new Mealmodel({
          type: meal.type,
          name: meal.name,
          category:meal.category,
          image: meal.image,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          fats: meal.fats,
          date: new Date()
        });
    
        const savedMeal = await newMeal.save()
        return savedMeal.name.toString();

      } catch (error) {
        console.error('Error adding new meal:', error);
        return null; 
    };

}

getMeals = async (): Promise<any> => {
   try {
      const meals = await Mealmodel.find()

      return meals
   } catch (error) {
      console.error(error)

      return null

   }
}

}
