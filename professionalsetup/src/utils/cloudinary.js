import { v2 as cloudinary } from 'cloudinary'
import fs, { unlinkSync } from 'fs'


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});



const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null
        // file upload
        const response = await cloudinary.uploader.upload(localPath, {
            use_filename: true,
            unique_filename: false,
            resource_type: "auto",
        })
        // file upload has been successfully uploaded
        console.log(`The file is sccuessfully uploaded! ${response.url}`);
        fs.unlinkSync(localPath)
        return response;

    } catch (error) {
        fs.unlinkSync(localPath) // remove all locally save temporary files
         
        return null;
    }
}

export {uploadOnCloudinary}