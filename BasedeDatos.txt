Base de datos
--------------------------------------------------
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(40),      -- Campo para el nombre completo del usuario
    nickname VARCHAR(20) UNIQUE,      -- Campo para el apodo o nombre de usuario, con restricción UNIQUE
    pass VARCHAR(255),                -- Longitud aumentada para almacenar contraseñas cifradas
    telefono CHAR(8) CHECK (telefono ~ '^[0-9]{8}$'),  -- Validación del formato del teléfono
    foto_perfil BYTEA                -- Campo para almacenar la foto de perfil

);

CREATE TABLE Mascotas (
    id_mascota SERIAL PRIMARY KEY,
    id_usuario INT,                   -- Clave externa para relacionar cada mascota con un usuario
    nombre_mascota VARCHAR(30),
    edad INT,
    peso DECIMAL(10,2),
    tipo_animal VARCHAR(60),          -- Nuevo campo para almacenar el tipo de animal
    raza VARCHAR(60),                 -- Campo para almacenar la raza de la mascota
    foto_perfil BYTEA,                -- Campo para almacenar la foto de perfil de la mascota
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Tareas (
    id_tarea SERIAL PRIMARY KEY,
    nombre_tarea VARCHAR(30),
    descripcion TEXT,                   -- Descripción de la tarea o recordatorio
    fecha_inicio DATE,                  -- Fecha de inicio para la tarea o recordatorio
    frecuencia VARCHAR(20),             -- Indica la frecuencia (diaria, semanal, etc.)
    completado BOOLEAN DEFAULT FALSE,   -- Estado de la tarea o recordatorio (completada o no)
    id_mascota INT,                     -- Clave foránea que hace referencia a la mascota
    id_usuario INT,                     -- Clave foránea que hace referencia al usuario
    FOREIGN KEY (id_mascota) REFERENCES Mascotas(id_mascota) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);


CREATE TABLE Metas (
    id_meta SERIAL PRIMARY KEY,
    descripcion TEXT,                     -- Descripción de la meta
    frecuencia VARCHAR(20),               -- Indica la frecuencia (diaria, semanal, fin de semana, mensual)
    fecha DATE,                           -- Fecha específica para la meta
    id_usuario INT,                       -- Clave foránea que relaciona la meta con un usuario
    id_mascota INT,                       -- Clave foránea que relaciona la meta con una mascota específica
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_mascota) REFERENCES Mascotas(id_mascota) ON DELETE CASCADE
);
--------------------------------------------------



--Esta parte es para hacer mis pruebas
----------------------------------------------------------------------------------------------------


SELECT MD5('123'); --Por seguridad

SELECT * FROM Usuario;

SELECT id_usuario, email, pass FROM Usuario WHERE email = '141@gmail.com';

-- Consultar todos los usuarios
SELECT * FROM Usuario
WHERE email = 'juan.perez@example.com'
AND pass = MD5('123456');


SELECT encode(foto_perfil, 'base64') AS foto_perfil_base64 FROM Usuario WHERE id_usuario = 4;

SELECT id_mascota, foto_perfil FROM Mascotas;

-- Consultar todas las mascotas
SELECT * FROM Mascotas;

-- Consultar todas las tareas
SELECT * FROM Tareas;

-- Consultar todas las metas
SELECT * FROM Metas;


-- Consultar las mascotas de un usuario específico (ejemplo para el usuario con id_usuario = 1)
SELECT * FROM Mascotas WHERE id_usuario = 1;

-- Consultar las tareas de una mascota específica (ejemplo para la mascota con id_mascota = 1)
SELECT * FROM Tareas WHERE id_mascota = 1;

-- Consultar las metas de un usuario específico (ejemplo para el usuario con id_usuario = 1)
SELECT * FROM Metas WHERE id_usuario = 1;



-- Ejemplo para verificar un hash usando MD5 en PostgreSQL
SELECT MD5('1234') AS hashed_pass;


----------------------------------------------------------------------------------------------------


--Eliminar tablas
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Mascotas CASCADE;
DROP TABLE IF EXISTS Tareas CASCADE;
DROP TABLE IF EXISTS Metas CASCADE;




