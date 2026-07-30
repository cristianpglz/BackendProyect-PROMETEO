import mongoose from "mongoose";

// Funcion asincrona para conectar a la base de datos
const connectDB = async () => {
    try {
        // Intentamos conectar usando la URI de las variables de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("[BASE DE DATOS] MongoDB Conectado con éxito: ${conn.connection.host}");
    }
    catch (error) {
        console.error("[ERROR] No se pudo conectar a la base de datos: ${error.message}")
        // Detener la palicacion si la conexion falla
        process.exit(1);
}};

export default connectDB;