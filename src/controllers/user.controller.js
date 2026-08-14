import User from "../models/user.js"; // Importamos el modelo del usuario
import Anime from "../models/anime.js"; // Importamos el modelo del anime

// Agregar animes a la lista de favoritos del usuario
export const addFavorite = async (req, res, next) =>{
    try {
        const { animeId } = req.params; // Recuperamos el ID del anime en los parametros de la ruta
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Agregamos el anime a la lista de favoritos del usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet : { favoriteAnimes: animeId } },
            { new: true}
        );
        // verificamos que el usuario se haya encontrado
        if (!updatedUser){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        // verificamos que el anime se haya agregado a favoritos 
        return res.status(200).json({
            message: "Anime agregado a favoritos correctamente",
            favoriteAnimes: updatedUser.favoriteAnimes
        });
    }catch (error) {
        return next(error);
     }
};


// Obtener el perfil del usuario autenticado con los datos completos de sus animes favoritos
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Buscamos al usuario por su ID y cargamos los datos de sus animes favoritos(excepto la contraseña)
        const user = await User.findById(userId)
                    .select("-password")
                    .populate("favoriteAnimes");
        // Verificamos que el usuario se haya encontrado
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Respondemos con los datos
        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

// Eliminar anime de favoritos

export const removeFavorite = async (req, res, next) => {
    try {
        const { animeId } = req.params; // Recuperamos el animeId de los parametros de la ruta
        const userId = req.user.id; // Recuperamos el ID del usuario autenticado desde el token

        // Eliminamos el anime de la lista de favoritos del usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteAnimes: animeId } },
            { new: true}
        );

        // Verificamos que el usuario se haya encontrado
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }
        // Confirmamos que el anime se haya eliminado de favoritos y respondemos con los datos actualizados
        return res.status(200).json({ 
            message: "Anime eliminado de favoritos",
            favoriteAnimes: updatedUser.favoriteAnimes
        });
    }catch (error) {
        return next (error);
    }
}