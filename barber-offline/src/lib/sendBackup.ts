
const API_URL = process.env.NEXT_PUBLIC_BACKUP_API ?? "http://localhost:4000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendBackup(snapshot: any) {
  const res = await fetch(`${API_URL}/backups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
    keepalive: true,
  });
  if (!res.ok) throw new Error("No se pudo guardar el backup");
}
