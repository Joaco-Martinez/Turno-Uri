CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS backups (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL    DEFAULT now(),
  payload    jsonb        NOT NULL
);

CREATE TABLE "Service" (
  "id"         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name"       text NOT NULL,
  "price"      double precision NOT NULL,
  "duration"   integer NOT NULL,
  "createdAt"  timestamptz NOT NULL DEFAULT now(),
  "updatedAt"  timestamptz NOT NULL DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups (created_at DESC);
