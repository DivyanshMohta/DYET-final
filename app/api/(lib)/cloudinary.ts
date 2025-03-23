// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dar6mcvkm',
  api_key: '616941356144945',
  api_secret: 'f76andfCE52JhAM60W601ssDoGQ',
});

export default cloudinary;

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folderPath: string,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folderPath,
          public_id: fileName,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error("Failed to upload notes"));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error("No result from Cloudinary"));
          }
        }
      )
      .end(fileBuffer);
  });
};