/**
 * Variables d'environnement injectées AVANT le chargement de tout module.
 * setupFiles s'exécute dans chaque worker Jest — les requires suivants
 * (app.js, config/db.js, …) liront ces valeurs.
 */
process.env.NODE_ENV    = 'test';
process.env.DB_HOST     = process.env.TEST_DB_HOST     || 'localhost';
process.env.DB_PORT     = process.env.TEST_DB_PORT     || '3308';
process.env.DB_NAME     = process.env.TEST_DB_NAME     || 'horizonr_db';
process.env.DB_USER     = process.env.TEST_DB_USER     || 'horizonr_user';
process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || 'horizonr_password';
process.env.JWT_SECRET  = 'horizonr_dev_secret';
