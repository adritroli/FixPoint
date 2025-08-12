ALTER TABLE companies
ADD COLUMN status ENUM(
    'activa',
    'inactiva',
    'en_proceso'
) NOT NULL DEFAULT 'en_proceso' AFTER email;