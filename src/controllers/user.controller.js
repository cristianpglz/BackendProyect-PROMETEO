import User from "../models/user.js";
import Anime from "../models/anime.js";

// Agregar animes a la lista de favoritos del usuario
export const addFavorite = async (req, res, next) =>{
    try {
        const { animeId} = req.params;
        const userId = req.user.id;


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet : { favoriteAnimes: animeId } },
            { new: true}
        );

        if (!updatedUser){
            return res.status(404).json({message: "Usuario no encontrado"});
        }

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
        const userId = req.user.id;

        const user = await User.findById(userId)
                    .select("-password") 
                    .populate("favoriteAnimes");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

// Eliminar anime de favoritos

export const removeFavorite = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteAnimes: animeId } },
            { new: true}
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }
        
        return res.status(200).json({ 
            message: "Anime eliminado de favoritos",
            favoriteAnimes: updatedUser.favoriteAnimes
        });
    }catch (error) {
        return next (error);
    }
}