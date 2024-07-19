
import multer from 'multer';

// for cloud uploads
const imageStorage = multer.memoryStorage();


// for uploading locally
const localstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
export const mealImageUpload = multer({ storage: localstorage });
export const trainerpofileupload = multer({ storage: imageStorage });
export const userpofileupload = multer({ storage: imageStorage });
export const videoupload = multer({ storage: imageStorage });

