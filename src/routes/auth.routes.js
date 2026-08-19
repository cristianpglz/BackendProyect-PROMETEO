import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import upload from "../config/cloudinary.js"; // Importamos la configuración de Cloudinary
const router = express.Router();

router.post("/register", upload.single("image"), register);


// Ruta para iniciar sesión y obtener el token
router.post("/login", login);
export default router;