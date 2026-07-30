import mongoose from "mongoose";

import "dotenv/config";

import Anime from "../models/Anime.js";

const animesIniciales = [
    {
        title: "Naruto Shippuden",
        studio: "Pierrot",
        year: 2007,
        genre: ["Shonen", "Accion", "Fantasia"],
        image: "https://m.media-amazon.com/images/M/MV5BNTk3MDA1ZjAtNTRhYS00YzNiLTgwOGEtYWRmYTQ3NjA0NTAwXkEyXkFqcGc@._V1_.jpg",
        description: "Un ninja huérfano y marginado, que lleva un demonio zorro sellado en su interior, lucha constantemente para superar sus límites, ganar el respeto de su aldea y convertirse en el líder (Hokage)."
    },
    {
        title: "One Piece",
        studio: "Toei Animation",
        year: 1999,
        genre: ["Shonen", "Accion", "Aventura"],
        image: "https://static.wikia.nocookie.net/doblaje/images/8/8d/One_Piece.png/revision/latest?cb=20190727212440&path-prefix=es",
        description: "Monkey D. Luffy, un chico que obtuvo poderes elásticos tras comer una fruta mística, recluta una tripulación pirata para navegar por un océano peligroso en busca del tesoro legendario que lo convertirá en el Rey de los Piratas."
    
    },
    {
        title: "Dragon Ball",
        studio: "Toei Animation",
        year: 1986,
        genre: ["Shonen", "Acción", "Aventura"],
        image: "https://i.ebayimg.com/images/g/~asAAOSwGuRixorh/s-l1200.jpg",
        description: "Goku, un niño con cola de mono y fuerza sobrehumana, viaja por el mundo buscando las Esferas del Dragón y entrenando artes marciales para proteger la Tierra"
    },{
        title: "Attack on Titan",
        studio: "Wit Studio (Temporadas 1–3) / MAPPA (Temporada Final)",
        year: 2013,
        genre: ["Shonen", "Acción", "Fantasía oscura", "Misterio"],
        image: "https://www.yourdecoration.com/cdn/shop/files/gbeye-fp3463-attack-on-titan-key-art-poster-61x91-5cm_e59bd348-bb51-44e4-8e02-87cd6d4e655e.jpg?v=1767619913",
        description: "La humanidad vive atrapada dentro de murallas para protegerse de titanes devoradores de hombres, hasta que el joven Eren Jaeger decide unirse al ejército para exterminarlos tras una tragedia personal."
    },{
        title: "Demon Slayer",
        studio: "Ufotable",
        year: 2019,
        genre: ["Shonen", "Acción", "Fantasía oscura"],
        image: "https://m.media-amazon.com/images/I/71B1eCWDPhL._AC_UF894,1000_QL80_.jpg",
        description: " Tanjiro Kamado se convierte en un cazador de demonios para vengar a su familia asesinada y encontrar una cura para su hermana Nezuko, quien fue transformada en demonio"
    },{ 
        title: "My Hero Academia",
        studio: "Bones",
        year: 2016,
        genre: ["Shonen", "Acción", "Superhéroes"],
        image: "https://m.media-amazon.com/images/I/71sNBqs5qWL._AC_UF894,1000_QL80_.jpg",
        description: "En un mundo donde casi todos tienen superpoderes, Izuku Midoriya nace sin ellos, pero hereda las habilidades del héroe número uno para estudiar en la academia de héroes más prestigiosa"
    },{
        title: "Jujutsu Kaisen",
        studio: "MAPPA",
        year: 2020,
        genre:  ["Shonen", "Acción", "Fantasía oscura"],
        image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS0eKMeWCdMuBMEmHOKPvcCZ--2QwkZttTC5TXq2lv6AGRfZS6o",
        description: "El estudiante Yuji Itadori se traga un dedo maldito para salvar a sus amigos, convirtiéndose en el recipiente del Rey de las Maldiciones, y debe unirse a una organización secreta de hechiceros para controlar ese poder"
    }
];

const seedDatabase = async () => {
    try {
        // 1. Conectamos a la base de datos temporalmente
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[SEEDER] Conectando a la base de datos...");

        // 2. Buscamos si ya existen animes y limpiamos la coleccion
        const existingAnimes = await Anime.find();
        if (existingAnimes.length > 0) {
            await Anime.collection.drop();
            console.log("[SEEDER] Coleccion antigua de animes eliminada correctamente");
        }

        // 3.Insertamos los nuevos datos
        await Anime.insertMany(animesIniciales);
        console.log("[SEEDER] Animes insertados correctamente")
    }
    catch (error) {
        console.log("[ERROR SEEDER] Ocurrio un problema:", error);
    } finally {
        // 4. Desconectamos pase lo que pase para que la terminal no se congele
        await mongoose.disconnect();
        console.log("[SEEDER] Desconectado de la base de datos")
    }

};

// Ejecutamos la funcion
seedDatabase();