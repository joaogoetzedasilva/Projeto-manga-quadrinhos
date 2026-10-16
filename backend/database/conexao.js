import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: 'admin',
  database: 'catalogo_quadrinhos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;