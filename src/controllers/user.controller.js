import User from "../models/user.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// Eliminar un usuario y su imagen asociada en Cloudinary
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        // Validamos que un usuario normal solo pueda borrar su propia cuenta
        if (requestingUserRole !== "admin" && requestingUserId !== id) {
            return res.status(403).json({ message: "Solo puedes eliminar tu propia cuenta" });
        }

        // Buscamos el usuario que se va a eliminar
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Si el usuario tiene una imagen, la borramos de los servidores de Cloudinary
        if (userToDelete.image) {
            const parts = userToDelete.image.split("/");
            const uploadIndex = parts.indexOf("upload");

            if (uploadIndex !== -1) {
                let publicIdParts = parts.slice(uploadIndex + 1);

                if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
                    publicIdParts.shift();
                }

                const publicIdWithExt = publicIdParts.join("/");
                const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf("."));

                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Eliminamos el registro del usuario de la base de datos de Mongo
        await User.findByIdAndDelete(id);

        return res.status(200).json({ message: "Usuario y su imagen eliminados correctamente" });
    } catch (error) {
        return next(error);
    }
};

// Actualizar el rol de un usuario (Funcionalidad exclusiva para Administradores)
export const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validamos el rol proporcionado para evitar colar datos raros en la base de datos
        if (role !== "admin" && role !== "user") {
             return res.status(400).json({ message: "Rol especificado no válido" });
        }

        // Actualizamos el rol del usuario y devolvemos el documento ya actualizado pero sin la contraseña
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: role },
            { new: true } // El new: true hace que nos devuelva el dato modificado, no el antiguo
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "Rol de usuario actualizado correctamente",
            user: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

// Agregar un anime a la lista de favoritos del usuario
export const addFavorite = async (req, res, next) => {
    try {
        const { animeId } = req.params; // Recuperamos el ID del anime de los parámetros de la ruta
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Agregamos el anime al array favoriteAnimes usando $addToSet para evitar duplicados
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteAnimes: animeId } },
            { new: true }
        );

        // Verificamos si el usuario fue encontrado
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Confirmamos que se ha añadido y devolvemos la lista actualizada
        return res.status(200).json({
            message: "Anime agregado a favoritos correctamente",
            favoriteAnimes: updatedUser.favoriteAnimes
        });
    } catch (error) {
        return next(error);
    }
};

// Obtener el perfil del usuario autenticado cargando también los datos de sus animes favoritos
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Buscamos el usuario por ID, excluimos la contraseña y populamos los datos de los animes
        const user = await User.findById(userId)
            .select("-password")
            .populate("favoriteAnimes");

        // Verificamos si el usuario fue encontrado
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Devolvemos todos los datos del perfil
        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

// Eliminar un anime de la lista de favoritos del usuario
export const removeFavorite = async (req, res, next) => {
    try {
        const { animeId } = req.params; // Recuperamos el ID del anime de los parámetros de la ruta
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Eliminamos el anime del array favoriteAnimes usando el operador $pull
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteAnimes: animeId } },
            { new: true }
        );

        // Verificamos si el usuario fue encontrado
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Confirmamos la eliminación y devolvemos la lista ya limpia
        return res.status(200).json({
            message: "Anime eliminado de favoritos",
            favoriteAnimes: updatedUser.favoriteAnimes
        });
    } catch (error) {
        return next(error);
    }
};

// Controlador para actualizar la imagen de perfil de usuario
export const updateUserAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Verificamos que se haya subio una imagen
        if (!req.file) {
            return res.status(400).json({ message: "La imagen es obligatoria" });
        }

        // Buscamos al usuario en la base de datos para obtener la URL de su imagen actual
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Controlamos si la imagen anterior existe y se elimina de cloudinary
        if (user.image) {
            const parts = user.image.split("/");
            const uploadIndex = parts.indexOf("upload");

            if (uploadIndex !== -1) {
                let publicIdParts = parts.slice(uploadIndex + 1);

                if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
                    publicIdParts.shift();
                }

                const publicIdWithExt = publicIdParts.join("/");
                const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf("."));

                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Actualizamos la URL de la nueva imagen
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: req.file.path },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Imagen de perfil actualizada correctamente",
            user: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

