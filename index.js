const express = require('express');
const cors = require('cors');
const connection = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Lista de Tareas funcionando.');
});

// Ruta: Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  connection.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Ruta: Agregar una tarea
app.post('/api/tareas', (req, res) => {
  const { titulo } = req.body;
  if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

  connection.query('INSERT INTO tareas (titulo) VALUES (?)', [titulo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, titulo });
  });
});

// Ruta: Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tarea eliminada correctamente' });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
