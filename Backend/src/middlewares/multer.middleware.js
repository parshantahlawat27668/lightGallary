import multer from "multer"
import path from "path"
const tempFolderPath = path.resolve("public/temp");

const diskStorage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,tempFolderPath);
    },
    filename:function(req, file, cb){
     cb(null,file.originalname);
    }
});     

const memoryStorage = multer.memoryStorage();

const uploadWithMemory = multer({
    storage:memoryStorage
});

const uploadWithDisk = multer({storage:diskStorage});

export {uploadWithDisk, uploadWithMemory};