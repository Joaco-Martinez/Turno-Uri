import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { prisma } from "./db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// ------------------- SERVICES -------------------

// Crear servicio
app.post("/services", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ ok: false, error: "Faltan campos" });
    }

    const service = await prisma.service.create({
      data: { name, price },
    });

    return res.status(201).json({ ok: true, data: service });
  } catch (err) {
    console.error("Error creando servicio:", err);
    return res.status(500).json({ ok: false, error: "Error creando servicio" });
  }
});

// Listar servicios
app.get("/services", async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ ok: true, data: services });
  } catch (err) {
    console.error("Error listando servicios:", err);
    return res.status(500).json({ ok: false, error: "Error listando servicios" });
  }
});

// Actualizar servicio
app.put("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: { name, price },
    });

    return res.json({ ok: true, data: service });
  } catch (err) {
    console.error("Error actualizando servicio:", err);
    return res.status(500).json({ ok: false, error: "Error actualizando servicio" });
  }
});

// Eliminar servicio
app.delete("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando servicio:", err);
    return res.status(500).json({ ok: false, error: "Error eliminando servicio" });
  }
});

// ------------------- BACKUPS -------------------

// Guarda EXACTO tu JSON (version, clients, appointments, exceptions)
app.post("/backups", async (req, res) => {
  try {
    const body = req.body;

    if (
      !body ||
      body.version !== 1 ||
      !Array.isArray(body.clients) ||
      !Array.isArray(body.appointments) ||
      !Array.isArray(body.exceptions)
    ) {
      return res.status(400).json({ ok: false, error: "Formato de backup inválido" });
    }

    const backup = await prisma.backup.create({
      data: { payload: body },
    });

    return res.status(201).json({ ok: true, id: backup.id });
  } catch (err) {
    console.error("Error guardando backup:", err);
    return res.status(500).json({ ok: false, error: "Error guardando backup" });
  }
});

// Devuelve el último backup
app.get("/backups/latest", async (_req, res) => {
  try {
    const latest = await prisma.backup.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, data: latest?.payload ?? null });
  } catch (err) {
    console.error("Error obteniendo backup:", err);
    return res.status(500).json({ ok: false, error: "Error obteniendo backup" });
  }
});

// ------------------- START -------------------
app.listen(PORT, () => {
  console.log(`Backups API listening on http://localhost:${PORT}`);
});
