const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Utilizar cookie-parser
app.use(cookieParser());

// Ruta para manejar las solicitudes a /id/:id
app.get('/id/:id', (req, res) => {
  const instanciaId = req.params.id;

  // Establecer una cookie con el ID de la instancia
  res.cookie('instanciaId', instanciaId, { maxAge: 900000});

  // Redirigir al navegador para servir el archivo index.html desde la carpeta public
  // O enviar directamente el archivo index.html
  res.sendFile(path.join(__dirname, 'public', '/movile/index.html'));
});

// Ruta genérica para capturar todas las solicitudes no manejadas por las rutas anteriores
// app.get('*', (req, res) => {
//   // Enviar el archivo index.html para cualquier ruta no definida
//   res.sendFile(path.join(__dirname, 'public', 'panelcontrol/index.html'));
// });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}/`);
});
