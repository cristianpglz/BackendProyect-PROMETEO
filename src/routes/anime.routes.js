import express from "express"; // Importamos express para crear las rutas

// Importamos los controladores de anime
import {
    getAllAnimes,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime
} from "../controllers/anime.controller.js";
import { isAuth, isAdmin } from  "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas publicas
router.get("/", getAllAnimes);
router.get("/:id", getAnimeById);

//Rutas protegidas
router.post("/", [isAuth, isAdmin], createAnime);
router.put("/:id", [isAuth, isAdmin], updateAnime);
router.delete("/:id", [isAuth, isAdmin], deleteAnime);


export default router;