const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME     || 'horizonr_db',
  user:     process.env.DB_USER     || 'horizonr_user',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

module.exports = pool;
