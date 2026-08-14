import jwt from "jsonwebtoken"; // generar y verificar tokens de autenticacion

import User from "../models/User.js"; // Importamos el modelo del usuario

// Middeleware para verificar si el usuario inicio sesion
export const isAuth = async (req, res, next) => {
    try{
        // 1. Obtener el token de la cabecera Authorization (Formato: Bearer <token>)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "No estas autorizado. Falta el token "})
        }
        // Eliminamos el inicio "bearer "
        const token = authHeader.split(" ")[1];

        // 2. Verificar y descodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "El usuario ya no existe"})
        }

        // 4. Añadir el objeto usuario a la petición para que los siguientes controladores puedan usarlo
        req.user = user;
        
        // Pasar el control a la siguiente funcion
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalido o caducado", error: error.message });
    }
}


// Middleware para verificar si el usuario tiene el rol de administrador
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin"){
        next();
    } else {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador"})
    }
}