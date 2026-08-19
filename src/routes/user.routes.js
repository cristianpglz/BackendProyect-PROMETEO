import express from "express";
import {deleteUser, 
    updateUserRole, 
    addFavorite, 
    getProfile, 
    removeFavorite,
    updateUserAvatar }from "../controllers/user.controller.js"; // Importamos los controladores de actualizacion de usuarios
import { isAuth, isAdmin } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/images.middleware.js";


const userRoutes = express.Router();

// Perfil y Favoritos (Tus rutas anteriores)
userRoutes.get("/profile", isAuth, getProfile);
userRoutes.post("/favorites/:animeId", isAuth, addFavorite);
userRoutes.delete("/favorites/:animeId", isAuth, removeFavorite);

// Borrar usuario (Requiere estar logueado, la lógica interna verifica si es admin o él mismo)
userRoutes.delete("/:id", isAuth, deleteUser);

// Actualizar rol (Requiere doble validación: estar logueado y ser Admin)
userRoutes.put("/:id/role", [isAuth, isAdmin], updateUserRole);
userRoutes.put("/profile/avatar", isAuth, upload.single("image"), updateUserAvatar);
export default userRoutes;