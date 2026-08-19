import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configuramos Cloudinary con las credenciales de nuestro archivo .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuramos el almacenamiento de archivos en Cloudinary usando multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "prometeo_users", // Carpeta en Cloudinary donde se guardan las imagenes de los usuarios
        allowedFormats: ["jpg", "png", "jpeg", "webp"]
    }
});

// Exportamos el multer configurado para subir archivos a Cloudinary
export const upload = multer({ storage });
export default upload;