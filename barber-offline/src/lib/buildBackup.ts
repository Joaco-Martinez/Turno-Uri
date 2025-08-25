// lib/buildBackup.ts
import { db } from "./db"; // tu Dexie con Client/Service/Appointment/Exception

export async function buildBackup() {
  const [clients, appointments, exceptions] = await Promise.all([
    db.clients.toArray(),
    db.appointments.toArray(),
    db.exceptions.toArray(),
  ]);

  return {
    version: 1,
    clients: clients.map(c => ({
      id: c.id,
      name: c.name,
      ...(c.phone ? { phone: c.phone } : {})
    })),
    appointments: appointments.map(a => ({
      id: a.id,
      ...(a.title ? { title: a.title } : {}),
      startDateTime: a.startDateTime,
      durationMin: a.durationMin,
      isRecurring: a.isRecurring,
      ...(a.rrule ? { rrule: a.rrule } : {}),
      serviceId: a.serviceId,
    })),
    exceptions: exceptions.map(e => ({
      id: e.id,
      appointmentId: e.appointmentId,
      originalDateTime: e.originalDateTime,
      type: e.type,
      ...(e.newStartDateTime ? { newStartDateTime: e.newStartDateTime } : {}),
      ...(typeof e.newDurationMin === "number" ? { newDurationMin: e.newDurationMin } : {}),
    })),
  };
}
