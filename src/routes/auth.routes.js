import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión y obtener el token
router.post("/login", login);
export default router;