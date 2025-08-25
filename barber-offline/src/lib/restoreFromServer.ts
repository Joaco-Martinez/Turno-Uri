/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/restoreFromServer.ts
import { db } from "./db";
const API_URL = process.env.NEXT_PUBLIC_BACKUP_API ?? "http://localhost:4000";

export async function restoreFromServer() {
  const r = await fetch(`${API_URL}/backups/latest`, { cache: "no-store" });
  const { ok, data } = await r.json();
  if (!ok || !data) throw new Error("No hay backups");

  const snap = data as {
    version: 1,
    clients: any[],
    appointments: any[],
    exceptions: any[],
  };

  await db.transaction('rw', db.clients, db.services, db.appointments, db.exceptions, async () => {
    await db.clients.clear();
    await db.appointments.clear();
    await db.exceptions.clear();

    await db.clients.bulkAdd(snap.clients);
    await db.appointments.bulkAdd(snap.appointments);
    await db.exceptions.bulkAdd(snap.exceptions);
    // Nota: Services no vienen en el backup; mantenés los existentes.
  });
}
