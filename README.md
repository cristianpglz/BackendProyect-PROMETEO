# Backend PROMETEO - API REST de Animes

API REST desarrollada con Node.js, Express y MongoDB para la gestión de un catálogo de animes y favoritos de usuarios. Incluye autenticación mediante JWT (JSON Web Tokens) y control de acceso basado en roles (`user` y `admin`).

---

## Tecnologías

* **Entorno / Framework:** Node.js + Express.js
* **Base de datos:** MongoDB + Mongoose
* **Almacenamiento de imágenes:** Cloudinary + Multer
* **Seguridad / Auth:** JWT (JSON Web Tokens) + Bcrypt
* **Gestor de paquetes:** PNPM
* **Pruebas de API:** Insomnia

---

## Instalación y Despliegue Local

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/cristianpglz/BackendProyect-PROMETEO.git
   cd BackendProyect-PROMETEO
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz (basándote en `.env.example`):
   ```
   env
   PORT=3000
   MONGO_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_clave_secreta_jwt
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

3. **Cargar datos iniciales (Seeder) e iniciar el servidor:**
   ```bash   
   pnpm seed
   pnpm dev
   ```
   *(El servidor se ejecutará en `http://localhost:3000`)*

---

## Endpoints de la API

| Método | Endpoint | Permisos | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Público | Registro de usuario con imagen de perfil (`role: "user"`) |
| `POST` | `/api/v1/auth/login` | Público | Iniciar sesión y obtener token JWT |
| `GET` | `/api/v1/users/profile` | Auth (`isAuth`) | Perfil del usuario con animes favoritos populados |
| `PUT` | `/api/v1/users/profile/avatar` | Auth (`isAuth`) | Actualizar la foto de perfil en Cloudinary |
| `POST` | `/api/v1/users/favorites/:animeId` | Auth (`isAuth`) | Añadir un anime a la lista de favoritos |
| `DELETE` | `/api/v1/users/favorites/:animeId` | Auth (`isAuth`) | Eliminar un anime de la lista de favoritos |
| `PUT` | `/api/v1/users/:id/role` | Admin (`isAdmin`) | Cambiar el rol de un usuario |
| `DELETE` | `/api/v1/users/:id` | Auth (`isAuth`) / Admin | Eliminar propia cuenta o cualquier usuario si es admin |
| `GET` | `/api/v1/animes` | Público | Obtener el catálogo completo de animes |
| `GET` | `/api/v1/animes/:id` | Público | Consultar un anime por su ID |
| `POST` | `/api/v1/animes` | Admin (`isAdmin`) | Crear un nuevo anime |
| `PUT` | `/api/v1/animes/:id` | Admin (`isAdmin`) | Editar un anime existente |
| `DELETE` | `/api/v1/animes/:id` | Admin (`isAdmin`) | Eliminar un anime del catálogo |

---

## Evidencias y Pruebas de Funcionamiento (Insomnia)

### 1. Consultas al Catálogo (`GET`)

* **`GET /api/v1/animes` (Sin Admin / Público):**
  ![GET Animes No Admin](imgs/image1.png)

* **`GET /api/v1/animes` (Con Admin):**
  ![GET Animes Admin](imgs/image2.png)

* **`GET /api/v1/animes/:id` (Sin Admin / Público):**
  ![GET ID No Admin](imgs/image3.png)

* **`GET /api/v1/animes/:id` (Con Admin):**
  ![GET ID Admin](imgs/image4.png)

---

### 2. Edición de Registros (`PUT`)

* **`PUT /api/v1/animes/:id` sin Token (`401 Unauthorized`):**
  ![PUT Sin Token](imgs/image5.png)

* **`PUT /api/v1/animes/:id` con Admin (`200 OK`):**
  ![PUT Admin](imgs/image6.png)

---

### 3. Borrado y Control de Permisos (`DELETE`)

* **`DELETE /api/v1/animes/:id` sin Token (`401 Unauthorized`):**
  ![DELETE Sin Token](imgs/image7.png)

* **`DELETE /api/v1/animes/:id` con Usuario Estándar (`403 Forbidden`):**
  ![DELETE anime (user mode)](imgs/image8.png)

* **`DELETE /api/v1/animes/:id` con Admin (`200 OK`):**
  ![DELETE Admin](imgs/image9.png)

---

### 4. Verificación de Borrado

* **Consulta tras eliminación (`404 Not Found`):**
  ![Comprobación 404](imgs/image10.png)

### 5. Registro y Subida de Imágenes (Cloudinary)

* **`/api/v1/users/register` (`200 OK` / `201 Created`):**
  ![POST user](imgs/image11.png)
  ![POST image](imgs/image12.png)


### 6. Eliminar usuarios (Siendo User)

* **`/api/v1/users/ID` como usuario a otro usuario(`403 Forbidden`):**
  ![DELETE user](imgs/image13.png)

### 7. Eliminar usuarios (Siendo Admin)

* **`/api/v1/users/ID` como admin (`200 OK`):**
  ![DELETE user (admin mode)](imgs/image14.png)

### 8. Eliminar cuenta propia

* **`/api/v1/users/profile` como usuario (`200 OK`):**
  ![DELETE profile](imgs/image15.png)

---
---
