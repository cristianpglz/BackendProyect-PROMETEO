import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Cargamos las variables de entorno para que el archivo pueda leer el .env
dotenv.config();

// 1. Configuramos la conexión con tu cuenta de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuramos el "motor de almacenamiento" (Storage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "PruebaPrometeo",
        allowedFormats: ["jpg", "png", "jpeg", "webp"]
    }
});

// 3. Exportamos el middleware 'upload'
export const upload = multer({ storage });