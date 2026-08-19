import User from "../models/User.js"; // Importamos el modelo del usuario
import bcrypt from "bcrypt"; // bcypt para encriptar la contraseña
import jwt from 'jsonwebtoken'; // jsonwebtoken para generar el token de autenticación
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validar existencia del usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existente" });
    }

    // Cifrar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extraer la URL de la imagen subida a Cloudinary desde req.file.path
    const imageUrl = req.file ? req.file.path : null;

    // Create user document
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image: imageUrl,
      role: "user"
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        role: newUser.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Iniciar sesión y devolver el token JWT
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario por su email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        // 3. Generar el token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Login realizado con éxito",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        return next(error);
    }
};