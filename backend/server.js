import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./db.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));


// Guarda EXACTO tu JSON (version, clients, appointments, exceptions)
app.post("/backups", async (req, res) => {
  try {
    const body = req.body;

app.post("/services", async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ ok: false, error: "Faltan campos" });
    }

    const id = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO services (id, name, price, duration) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, name, price, duration]
    );

    return res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error creando servicio" });
  }
});

// Listar servicios
app.get("/services", async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM services ORDER BY created_at DESC`);
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error listando servicios" });
  }
});

// Actualizar servicio
app.put("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration } = req.body;

    const { rows } = await pool.query(
      `UPDATE services 
       SET name=$1, price=$2, duration=$3, updated_at=now()
       WHERE id=$4 RETURNING *`,
      [name, price, duration, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Servicio no encontrado" });
    }

    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error actualizando servicio" });
  }
});

// Eliminar servicio
app.delete("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(`DELETE FROM services WHERE id=$1`, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Servicio no encontrado" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error eliminando servicio" });
  }
});

    // Validación mínima del formato que pediste
    if (
      !body ||
      body.version !== 1 ||
      !Array.isArray(body.clients) ||
      !Array.isArray(body.appointments) ||
      !Array.isArray(body.exceptions)
    ) {
      return res.status(400).json({ ok: false, error: "Formato de backup inválido" });
    }

    const id = uuidv4();
    await pool.query(
      `INSERT INTO backups (id, payload) VALUES ($1, $2::jsonb)`,
      [id, JSON.stringify(body)]
    );

    return res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error guardando backup" });
  }
});

// Devuelve el último backup (para restaurar)
app.get("/backups/latest", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT payload FROM backups ORDER BY created_at DESC LIMIT 1`
    );
    const payload = rows[0]?.payload ?? null;
    return res.json({ ok: true, data: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error obteniendo backup" });
  }
});

app.listen(PORT, () => {
  console.log(`Backups API listening on http://localhost:${PORT}`);
});
