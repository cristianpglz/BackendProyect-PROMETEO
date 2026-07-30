import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const {username, email, password, image } = req.body;

        //1. validamos si el usuario o el email ya existen en la base de datos
        const userExists = await User.findOne({ $or: [{email}, {username}]})
        if (userExists) {
            return res.status(400).json({message: "El nombre de usuario o el email no son correctos"})
        }

        //2. Encriptar la contraseña
        //El numero 10 indica la complejidad de la encriptacion
        const hashedPassword = await bcrypt.hash(password, 10);

        //3. Creamos el nuevo usuario
        // Forzamos a que el nuevo usuario siempre sea "user" al registrarse
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image: image || "https://via.placeholder.com/150",
            role: "user"
        });

        //4. Guardamos en la base de datos
        await newUser.save();

        //5. Responder al cliente
        return res.status(201).json({
            message: "Usuario registrado con exito",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                image: newUser.image,
                role: newUser.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor al registrar el nuevo usuario", error: error.message});
    }
}

// Controlador para iniciar sesión (Login)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario por su email en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Credenciales incorrectas (Email no encontrado)" });
        }

        // 2. Comparar la contraseña introducida con la encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales incorrectas (Contraseña falsa)" });
        }

        // 3. Si todo es correcto, generar el Token JWT con el ID del usuario
        const token = jwt.sign(
            { id: user._index || user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } // El token caducará en un día
        );

        // 4. Devolver los datos del usuario y el token generado
        return res.status(200).json({
            message: 'Login realizado con éxito',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};