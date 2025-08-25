const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  created_at?: string;
  updated_at?: string;
};

// 📌 Listar servicios
export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener servicios");
  const data = await res.json();
  return data.data;
}

// 📌 Crear servicio
export async function createService(service: Omit<Service, "id" | "created_at" | "updated_at">) {
  const res = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Error al crear servicio");
  return (await res.json()).data;
}

// 📌 Actualizar servicio
export async function updateService(id: string, service: Partial<Service>) {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Error al actualizar servicio");
  return (await res.json()).data;
}

// 📌 Eliminar servicio
export async function deleteService(id: string) {
  const res = await fetch(`${API_URL}/services/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar servicio");
  return (await res.json()).ok;
}
