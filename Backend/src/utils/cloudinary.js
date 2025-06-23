import fs from "fs"
import {v2 as cloudinary} from "cloudinary"
import {config} from "dotenv"
config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath)=>{
if(!localFilePath){
console.log("No file path provided to upload");
return null;
}
try {
    const result = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    });
    if(fs.existsSync(localFilePath)){
        fs.unlinkSync(localFilePath);
    }
    return {
        url:result.secure_url,
        public_id:result.public_id,
        resource_type:result.resource_type
    }

} catch (error) {
    console.log(error);
    if(fs.existsSync(localFilePath)){
     fs.unlinkSync(localFilePath);
    }
   return null
}

}

const deleteFromCloudinary = async (public_id)=>{
    try {
        
        const result = cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.log(error);
    }

}
export {uploadToCloudinary, deleteFromCloudinary};