const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', 
    password: '1234',
    port: 5432,
});



// Registro de usuario
app.post('/register', async (req, res) => {
    const { email, nombre_completo, nickname, pass, telefono } = req.body;
    
    try {
        // Genera un hash para la contraseña (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Inserta el usuario con la contraseña cifrada
        const result = await pool.query(
            `INSERT INTO Usuario (email, nombre_completo, nickname, pass, telefono) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [email, nombre_completo, nickname, hashedPassword, telefono]
        );
        
        // Responde con el usuario creado
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});


// Cambia el método de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    
    try {
        const result = await pool.query(
            `SELECT * FROM Usuario WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = result.rows[0];
        
        // Compara la contraseña proporcionada con el hash almacenado
        const match = await bcrypt.compare(pass, usuario.pass);
        
        if (match) {
            res.status(200).json({ message: 'Inicio de sesión exitoso', user: usuario });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Rutas para obtener datos de usuarios, mascotas, tareas, y metas
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Usuario');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});



app.get('/usuario-actual', async (req, res) => {
    try {
        // Esto es solo para pruebas. Deberías reemplazarlo por lógica de autenticación
        const result = await pool.query('SELECT id_usuario FROM Usuario LIMIT 1');
        
        if (result.rows.length > 0) {
            res.status(200).json({ id: result.rows[0].id_usuario });
        } else {
            res.status(404).json({ error: 'No se encontró un usuario' });
        }
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        res.status(500).json({ error: 'Error al obtener usuario actual' });
    }
});


app.get('/get-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id_usuario, email, nombre_completo, nickname, telefono, 
                    encode(foto_perfil, 'base64') AS foto_perfil 
             FROM Usuario 
             WHERE id_usuario = $4`,
            [id]
        );

        if (result.rows.length > 0) {
            console.log("Imagen en base64:", result.rows[0].foto_perfil); // Verificar el contenido
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Ruta para obtener la imagen de perfil del usuario actual en base64
app.get('/user-photo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT encode(foto_perfil, \'base64\') AS foto_perfil_base64 FROM Usuario WHERE id_usuario = $1',
            [id]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ foto_perfil_base64: result.rows[0].foto_perfil_base64 });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la foto de perfil del usuario:', error);
        res.status(500).json({ error: 'Error al obtener la foto de perfil del usuario' });
    }
});







app.get('/mascotas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Mascotas');
        const mascotas = result.rows.map(mascota => {
            if (mascota.foto_perfil) {
                mascota.foto_perfil = mascota.foto_perfil.toString('base64');  // Convertir la imagen a base64
            }
            return mascota;
        });
        res.json(mascotas);
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        res.status(500).json({ error: 'Error al obtener mascotas' });
    }
});





// Ruta para agregar un nuevo recordatorio/tarea
app.post('/tareas', async (req, res) => {
    const { nombre_tarea, descripcion, fecha_inicio, frecuencia, completado, id_usuario, id_mascota } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO Tareas (nombre_tarea, descripcion, fecha_inicio, frecuencia, completado, id_usuario, id_mascota) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nombre_tarea, descripcion, fecha_inicio, frecuencia, completado, id_usuario, id_mascota]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar tarea:', error);
        res.status(500).json({ error: 'Error al agregar tarea' });
    }
});









app.delete('/eliminarmetas/:id_meta', async (req, res) => {
    const { id_meta } = req.params;
    console.log('ID recibido para eliminar:', id_meta);

    try {
        const result = await pool.query(
            'DELETE FROM Metas WHERE id_meta = $1 RETURNING *',
            [id_meta]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Meta eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Meta no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar meta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.post('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { email, nombre_completo, nickname, telefono, foto_perfil } = req.body;

    try {
        const fotoBuffer = foto_perfil ? Buffer.from(foto_perfil, 'base64') : null;

        const result = await pool.query(
            `UPDATE Usuario 
             SET email = $1, nombre_completo = $2, nickname = $3, telefono = $4, foto_perfil = $5 
             WHERE id_usuario = $6 RETURNING *`,
            [email, nombre_completo, nickname, telefono, fotoBuffer, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});



app.post('/add-mascotas', async (req, res) => {
    const { id_usuario, nombre_mascota, edad, peso, tipo_animal, raza, foto_perfil } = req.body;

    try {
        const fotoBuffer = foto_perfil ? Buffer.from(foto_perfil, 'base64') : null;
        const result = await pool.query(
            `INSERT INTO Mascotas (id_usuario, nombre_mascota, edad, peso, tipo_animal, raza, foto_perfil) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_usuario, nombre_mascota, edad, peso, tipo_animal, raza, fotoBuffer]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar mascota:', error);
        res.status(500).json({ error: 'Error al agregar mascota' });
    }
});




app.get('/mascotas/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM Mascotas WHERE id_usuario = $1',
            [id_usuario]
        );
        const mascotas = result.rows.map(mascota => {
            if (mascota.foto_perfil) {
                mascota.foto_perfil = mascota.foto_perfil.toString('base64');
            }
            return mascota;
        });
        res.json(mascotas);
    } catch (error) {
        console.error('Error al obtener mascotas del usuario:', error);
        res.status(500).json({ error: 'Error al obtener mascotas del usuario' });
    }
});


// Ruta para completar una tarea
app.put('/completar-tarea/:id_tarea', async (req, res) => {
    const { id_tarea } = req.params;

    try {
        const result = await pool.query(
            `UPDATE Tareas
             SET completado = true
             WHERE id_tarea = $1
             RETURNING *`,
            [id_tarea]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Tarea completada exitosamente', tarea: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al completar tarea:', error);
        res.status(500).json({ error: 'Error al completar tarea' });
    }
});




app.delete('/eliminar-tarea/:id_tarea', async (req, res) => {
    const { id_tarea } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM Tareas WHERE id_tarea = $1 RETURNING *',
            [id_tarea]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Tarea eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
});




// back.js

app.post('/add-reminder', async (req, res) => {
    let { nombre_tarea, descripcion, fecha_inicio, frecuencia, id_mascota, id_usuario } = req.body;

    // Convertir valores vacíos a null para los campos que esperan enteros
    id_mascota = id_mascota === '' ? null : id_mascota;
    id_usuario = id_usuario === '' ? null : id_usuario;

    // Imprimir los datos procesados para verificar
    console.log("Datos procesados para agregar tarea:", {
        nombre_tarea,
        descripcion,
        fecha_inicio,
        frecuencia,
        id_mascota,
        id_usuario
    });

    try {
        const result = await pool.query(
            `INSERT INTO Tareas (nombre_tarea, descripcion, fecha_inicio, frecuencia, id_mascota, id_usuario) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre_tarea, descripcion, fecha_inicio, frecuencia, id_mascota, id_usuario]
        );

        // Imprimir el resultado de la inserción en la base de datos
        console.log("Resultado de la inserción:", result.rows[0]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar tarea:', error);
        res.status(500).json({ error: 'Error al agregar tarea' });
    }
});




app.get('/tareas-pendientes/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM tareas WHERE id_usuario = $1 AND completado = false',
            [id_usuario]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tareas pendientes:', error);
        res.status(500).json({ error: 'Error al obtener tareas pendientes' });
    }
});





// Ruta para agregar una nueva meta
app.post('/metas', async (req, res) => {
    const { descripcion, frecuencia, fecha, id_usuario, id_mascota } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO Metas (descripcion, frecuencia, fecha, id_usuario, id_mascota) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [descripcion, frecuencia, fecha, id_usuario, id_mascota]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar meta:', error);
        res.status(500).json({ error: 'Error al agregar meta' });
    }
});

app.get('/metas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Metas');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener metas:', error);
        res.status(500).json({ error: 'Error al obtener metas' });
    }
});

// Ruta para obtener todas las metas de una mascota específica
app.get('/metas/:id_mascota', async (req, res) => {
    const { id_mascota } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM Metas WHERE id_mascota = $1',
            [id_mascota]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener metas:', error);
        res.status(500).json({ error: 'Error al obtener metas' });
    }
});










// Ruta para obtener las metas de una mascota específica
app.get('/metas/:id_mascota', async (req, res) => {
    const { id_mascota } = req.params;
    console.log(`Recibiendo solicitud para obtener metas de la mascota con ID: ${id_mascota}`); // Log para verificar el parámetro recibido

    try {
        const result = await pool.query(
            'SELECT * FROM Metas WHERE id_mascota = $1',
            [id_mascota]
        );
        console.log(`Metas obtenidas para la mascota ${id_mascota}:`, result.rows); // Log para revisar el resultado de la consulta
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener metas de la mascota:', error);
        res.status(500).json({ error: 'Error al obtener metas de la mascota' });
    }
});


app.put('/update-user/:id', async (req, res) => {
    const { id } = req.params;  // Obtener el ID del usuario desde los parámetros de la ruta
    const { email, nombre_completo, nickname, telefono, foto_perfil } = req.body;

    try {
        // Convierte la foto de perfil de base64 a buffer, si existe
        const fotoBuffer = foto_perfil ? Buffer.from(foto_perfil, 'base64') : null;

        // Actualizar el usuario en la base de datos
        const result = await pool.query(
            `UPDATE Usuario 
             SET email = $1, nombre_completo = $2, nickname = $3, telefono = $4, foto_perfil = $5 
             WHERE id_usuario = $6 RETURNING *`,
            [email, nombre_completo, nickname, telefono, fotoBuffer, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);  // Retornar el usuario actualizado
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});



// Obtener todas las metas para el administrador
app.get('/vermetas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT m.*, u.nombre_completo AS nombre_usuario, u.email, mas.nombre_mascota 
             FROM Metas m
             JOIN Usuario u ON m.id_usuario = u.id_usuario
             JOIN Mascotas mas ON m.id_mascota = mas.id_mascota`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener todas las metas:', error);
        res.status(500).json({ error: 'Error al obtener todas las metas' });
    }
});







// Ruta para obtener todas las metas junto con la información de usuario y mascota
app.get('/vermetas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT m.id_meta, m.descripcion, m.frecuencia, m.fecha,
                    u.nombre_completo AS nombre_usuario, u.email, mas.nombre_mascota
             FROM Metas m
             JOIN Usuario u ON m.id_usuario = u.id_usuario
             JOIN Mascotas mas ON m.id_mascota = mas.id_mascota`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener todas las metas:', error);
        res.status(500).json({ error: 'Error al obtener todas las metas' });
    }
});

// Ruta para obtener todas las tareas junto con la información de usuario y mascota
app.get('/vertareas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.id_tarea, t.nombre_tarea, t.descripcion, t.fecha_inicio, 
                    t.frecuencia, t.completado, 
                    u.nombre_completo AS nombre_usuario, u.email, mas.nombre_mascota
             FROM Tareas t
             JOIN Usuario u ON t.id_usuario = u.id_usuario
             JOIN Mascotas mas ON t.id_mascota = mas.id_mascota`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener todas las tareas:', error);
        res.status(500).json({ error: 'Error al obtener todas las tareas' });
    }
});


app.put('/update-mascota/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_mascota, edad, peso, tipo_animal, raza, foto_perfil } = req.body;

    try {
        const query = `
            UPDATE mascotas
            SET nombre_mascota = $1, 
                edad = $2, 
                peso = $3, 
                tipo_animal = $4, 
                raza = $5, 
                foto_perfil = $6
            WHERE id_mascota = $7
            RETURNING *;
        `;
        
        const values = [nombre_mascota, edad, peso, tipo_animal, raza, foto_perfil, id];
        
        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        res.json({ message: 'Mascota actualizada con éxito', mascota: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        res.status(500).json({ error: 'Error al actualizar la mascota' });
    }
});


// Obtener todas las tareas
app.get('/vertareas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                tareas.id_tarea, 
                tareas.nombre_tarea, 
                tareas.descripcion, 
                tareas.frecuencia, 
                tareas.fecha_hora, 
                usuarios.nombre_completo AS nombre_usuario, 
                usuarios.email AS email_usuario, 
                mascotas.nombre_mascota 
            FROM tareas 
            JOIN usuarios ON tareas.id_usuario = usuarios.id_usuario 
            JOIN mascotas ON tareas.id_mascota = mascotas.id_mascota
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener tareas:', err);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});



// Eliminar una tarea
app.delete('/eliminartarea/:id_tarea', async (req, res) => {
    const { id_tarea } = req.params;
    console.log(`Eliminando tarea con ID: ${id_tarea}`); // Log para depuración
    try {
        const deleteQuery = 'DELETE FROM tareas WHERE id_tarea = $1';
        await pool.query(deleteQuery, [id_tarea]);

        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (err) {
        console.error('Error al eliminar tarea:', err);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
});



// Actualizar una meta
app.put('/update-meta/:id_meta', async (req, res) => {
    const { id_meta } = req.params;
    const { descripcion, frecuencia, fecha } = req.body;

    try {
        const updateQuery = `
            UPDATE metas 
            SET 
                descripcion = $1, 
                frecuencia = $2, 
                fecha = $3 
            WHERE id_meta = $4
        `;

        await pool.query(updateQuery, [
            descripcion,
            frecuencia,
            fecha,
            id_meta,
        ]);

        res.status(200).json({ message: 'Meta actualizada con éxito' });
    } catch (err) {
        console.error('Error al actualizar meta:', err);
        res.status(500).json({ error: 'Error al actualizar meta' });
    }
});


// Iniciar el servidor
app.listen(5000, () => { 
    console.log('API ejecutándose en el puerto 5000');
});
