// Archivo principal de la aplicacion
// Importamos dependencias necesarias
import "dotenv/config";

import express from "express";

import cors from "cors"; // Importamos cors para permitir peticiones desde otros dominios

import connectDB from "./config/db.js";


import authRoutes from "./routes/auth.routes.js";

import animeRoutes from "./routes/anime.routes.js";

import userRoutes from "./routes/user.routes.js";
// Conectar a la base de datos
connectDB();


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware para parsear/procesar los cuerpos de las peticiones en formato JSON 
app.use(cors());
app.use(express.json());

// Usar las rutas en la aplicacion
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/animes', animeRoutes);
app.use("/api/v1/users", userRoutes);


// Ruta para comprobar que responde el servidor
app.get(`/api/v1/health`, (req, res) => {
    res.status(200).json({ status: `OK`, message : `El servidor esta funcionando correctamente`})
})

// Rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Gestion global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Error interno del servidor"
    })
})


// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`[SERVIDOR] Ejecutándose correctamente en http://localhost:${PORT}`)
})