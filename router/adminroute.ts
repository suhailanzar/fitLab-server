import { Router } from 'express';
import { adminRepository } from '../repositories/adminRepository';
import { adminInteractor } from '../interactors/adminInteractor';
import { adminController } from '../controllers/admincontroller';
import { mealImageUpload } from '../utils/multer'
const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new adminRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new adminInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new adminController(interactor);

//call the onsignup method of the Usercontroller instance to handle the signup process
router.post('/login',controller.login.bind(controller))
router.post('/addmeal',mealImageUpload.single('image'),controller.addmeal.bind(controller))
router.get('/getTrainersReq',controller.get_requests.bind(controller))
router.get('/getTrainers',controller.getTrainers.bind(controller))
router.put('/trainerApproval/:id',controller.trainerApproval.bind(controller))
router.get('/viewtrainer/:id',controller.trainerDetails.bind(controller))
router.get('/getMeals',controller.getMeals.bind(controller))


  

export default router;