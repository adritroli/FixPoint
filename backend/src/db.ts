import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Cambia por tu usuario
  password: "nairda", // Cambia por tu contraseña
  database: "fixpoint",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
