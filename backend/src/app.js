const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth');
const employesRoutes  = require('./routes/employes');
const congesRoutes    = require('./routes/conges');
const planningRoutes  = require('./routes/planning');
const dashboardRoutes = require('./routes/dashboard');
const profilRoutes    = require('./routes/profil');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost', 'http://localhost:80'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/employes',  employesRoutes);
app.use('/api/conges',    congesRoutes);
app.use('/api/planning',  planningRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profil',    profilRoutes);

// Route santé
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'HorizonR', version: '1.0.0' });
});

// Gestion 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion erreurs globale
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`HorizonR API démarrée sur le port ${PORT}`);
});

module.exports = app;
