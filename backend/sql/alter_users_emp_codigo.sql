ALTER TABLE users
ADD COLUMN emp_codigo VARCHAR(32) NOT NULL AFTER id,
DROP FOREIGN KEY IF EXISTS users_ibfk_company, -- solo si tienes FK
DROP COLUMN emp_codigo;