
import multer from 'multer';

// for cloud uploads
const imageStorage = multer.memoryStorage();


// for uploading locally meal image 
const localstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/mealImages');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

// for uploading locally thumbnails
const localstoragethumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/thumbnails');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  
export const mealImageUpload = multer({ storage: localstorage });
export const thumbnails = multer({ storage: localstoragethumbnail });
export const trainerpofileupload = multer({ storage: imageStorage }); 
export const userpofileupload = multer({ storage: imageStorage });
export const videoupload = multer({ storage: imageStorage });

