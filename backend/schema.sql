-- Extensión para UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de backups (guarda tu JSON exacto)
CREATE TABLE IF NOT EXISTS backups (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL    DEFAULT now(),
  payload    jsonb        NOT NULL
);

-- Índice opcional para ordenar rápido por fecha
CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups (created_at DESC);
