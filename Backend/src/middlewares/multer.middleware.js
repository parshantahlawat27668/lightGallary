import multer from "multer"
import path from "path"
const tempFolderPath = path.resolve("public/temp");
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,tempFolderPath);

    },
    filename:function(req, file, cb){
     const ext = path.extname(file.originalname);
     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
     cb(null, uniqueName);
    }
});     

export const upload = multer({storage});