'use client';
import { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from "../../lib/service";

type Service = { id: string; name: string; price: number };

export default function PricesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(''); // 👈 siempre string en el input

  // cargar servicios al inicio
  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const all = await getServices();
    console.log("Servicios recibidos:", all);
    setServices(all ?? []); // 👈 asegurar que agarras data
  }

  async function addService() {
    if (!newName.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }
    if (newPrice === '' || Number(newPrice) < 0) {
      alert("El precio debe ser mayor o igual a 0");
      return;
    }

    await createService({
      name: newName,
      price: Number(newPrice),
      duration: 30,
    });

    setNewName("");
    setNewPrice("");
    loadServices();
  }

  async function updatePrice(id: string, price: number) {
    if (price < 0) {
      alert("El precio no puede ser negativo");
      return;
    }
    await updateService(id, { price });
    loadServices();
  }

  async function removeService(id: string) {
    await deleteService(id);
    loadServices();
  }

  return (
    <div className="card p-4 space-y-4">
      <h2 className="text-lg font-bold">💲 Precios de servicios</h2>

      {/* lista de servicios */}
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span className="flex-1">{s.name}</span>
            <input
              type="number"
              value={String(s.price)}
              onChange={(e) => updatePrice(s.id, Number(e.target.value))}
              className="border rounded px-2 py-1 w-28 text-right"
            />
            <button
              onClick={() => removeService(s.id)}
              className="px-2 py-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              ✕
            </button>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-sm text-zinc-500">No hay servicios aún</p>
        )}
      </div>

      {/* agregar nuevo */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Servicio (ej: Corte)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Precio"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-32 border rounded px-2 py-1"
        />
        <button
          onClick={addService}
          className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-500"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
