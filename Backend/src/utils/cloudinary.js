import fs from "fs"
import {v2 as cloudinary} from "cloudinary"
import {config} from "dotenv"
config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (buffer, filename, folder = "products")=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({
            resource_type:"image",
            folder,
            public_id:filename.split(".")[0]
        },
        (error, result)=>{
            if(error){
                console.log("Cloudinary Upload error: ", error);
                return reject(error);
            }
            resolve({
                url:result.secure_url,
                public_id:result.public_id,
                resource_type:result.resource_type
            });
        }
    ).end(buffer);
    })
}

const deleteFromCloudinary = async (public_id)=>{
    try {     
        const result = cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.log(error);
    }

}
export {uploadToCloudinary, deleteFromCloudinary};