import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    studio: { type: String, required: true },
    year: { type: Number, required: true },
    genre: [{ type: String }],
    image: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true // Crea automaticamente campos de fecha de creacion y actualizacion
});

export default mongoose.models.Anime || mongoose.model("Anime", animeSchema);