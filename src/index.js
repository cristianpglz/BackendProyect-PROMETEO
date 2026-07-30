// Cargar las variables de entorno desde el archivo .env
import "dotenv/config";

import express from "express";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";

import animeRoutes from "./routes/anime.routes.js";

import userRoutes from "./routes/user.routes.js";
// Conectar a la base de datos
connectDB();


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware para parsear/procesar los cuerpos de las peticiones en formato JSON 
app.use(express.json());

// Usar las rutas en la aplicacion
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/animes', animeRoutes);
app.use("/api/v1/users", userRoutes);


// Ruta para comprobar que responde el servidor
app.get(`/api/v1/health`, (req, res) => {
    res.status(200).json({ status: `OK`, message : `El servidor esta funcionando correctamente`})
})


// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`[SERVIDOR] Ejecutándose correctamente en http://localhost:${PORT}`)
})