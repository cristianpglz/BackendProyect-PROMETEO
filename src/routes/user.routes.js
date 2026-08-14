import express from "express";
import { addFavorite, getProfile, removeFavorite }from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

// Obtener el perfil del usuario autenticado (con animes favoritos cargados)
userRoutes.get("/profile", isAuth, getProfile);

// Agregamos a favoritos
userRoutes.put("/favorites/:animeId", isAuth, addFavorite);

// Eliminamos de Favoritos
userRoutes.delete("/favorites/:animeId", isAuth, removeFavorite)
export default userRoutes;