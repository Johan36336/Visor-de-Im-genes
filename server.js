const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurar multer para guardar archivos en carpeta images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Ruta para subir imagen
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

  const nombre = req.file.originalname;
  const url = `/images/${req.file.filename}`;

  const stmt = db.prepare('INSERT INTO imagenes (nombre, url) VALUES (?, ?)');
  stmt.run(nombre, url, function (err) {
    if (err) return res.status(500).json({ error: 'Error al guardar en la BD' });
    res.json({ id: this.lastID, nombre, url });
  });
  stmt.finalize();
});

// Ruta para obtener todas las imágenes
app.get('/api/images', (req, res) => {
  db.all('SELECT * FROM imagenes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar imágenes' });
    res.json(rows);
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
