import mongoose from "mongoose";

// Definimos el esquema del usuario
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique:true },
    password: {type: String, required: true },
    image: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user" // Por defecto siempre User
    },
    // Array procedente de otra coleccion
    favoriteAnimes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime"//Debe coincidir con el modelo mapeado
    }]
}, {
    timestamps: true //crea automaticamente campos de fecha de creacion y actualidad
});
// Exportamos el modelo del usuario
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;