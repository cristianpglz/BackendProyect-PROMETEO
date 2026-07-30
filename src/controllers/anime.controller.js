import Anime from "../models/Anime.js";

//GET - Obtener todos los animes de la base de datos
export const getAllAnimes = async (req, res) => {
    try {
        const animes = await Anime.find();
        return res.status(200).json(animes);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los animes", error: error.message})
    }
};

// GET - Obtener un unico anime por su ID
export const getAnimeById = async (req, res) => {
    try {
        const {id} = req.params;
        const anime = await Anime .findById(id);
        if (!anime){
            return res.status(404).json({ message: "Anime no encontrado"});
        }
        return res.status(200).json(anime);
    }catch (error) {
        return res.status(500).json({ message: "Error al encontrar el anime", error: error.message});
    }
};

// POST - Crear un anime (Solo Administradores)
export const createAnime = async (req, res) => {
    try { 
        const newAnime = new Anime(req.body);
        const savedAnime = await newAnime.save();
        return res.status(201).json(savedAnime);
    }catch (error) {
        return res.status(400).json({message: "error al crear el Anime", error: error.message})
    }
};


//PUT - Actualiza un anime existente (Solo Administradores)
export const updateAnime = async (req, res) => {
    try {
        const {id} = req.params;
        const updateAnime = await Anime.findByIdAndUpdate(id, req.body, {new: true});
        if (!updateAnime){
            return res.status(404).json({message: "Anime no encontrado", error: error.message});
        }
        
    return res.status(200).json(updateAnime);
    
    }catch (error) {
        return res.status(400).json({ message: "error al actualizar el anime", error: error.message});
    }
}


// DELETE - Eliminar un anime (Solo Administrador)
export const deleteAnime = async (req, res) => {
    try {
        const {id} = req.params;
        const deleteAnime = await Anime.findByIdAndDelete(id);
        if (!deleteAnime){
            return res.status(404).json({ message: "anime no encontrado"});
        }
        return res.status(200).json(({ message: "Anime eliminado correctamente"}));
    }catch (error) {
        return res.status(500).json({ message: "Error al eliminar el anime", error: error.message})
    }
}