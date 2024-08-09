
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// for cloud uploads
const imageStorage = multer.memoryStorage();



  const mealimages = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = getAbsolutePath('../public/meals');
      // Create the directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

function getAbsolutePath(relativePath:string):string {
  return path.resolve(__dirname, relativePath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = getAbsolutePath('../public/reports');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});



  
export const mealImageUpload = multer({ storage: mealimages });
// export const thumbnails = multer({ storage: localstoragethumbnail });
export const trainerpofileupload = multer({ storage: imageStorage }); 
export const userpofileupload = multer({ storage: imageStorage });
export const videoupload = multer({ storage: imageStorage });
export const reportfile = multer({ storage: storage });

