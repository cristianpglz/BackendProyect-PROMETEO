import express from "express";
import { addFavorite, getProfile }from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

// Obtener el perfil del usuario autenticado (con animes favoritos cargados)
userRoutes.get("/profile", isAuth, getProfile);

//Agregamos a favoritos
userRoutes.put("/favorites/:animeId", isAuth, addFavorite);

export default userRoutes;