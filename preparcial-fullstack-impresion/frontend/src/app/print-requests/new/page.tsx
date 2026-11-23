import Link from "next/link";
import { redirect } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import type { Printer, PrintRequest } from "../../../lib/print-types";

async function createPrintRequest(formData: FormData) {
  "use server";

  const body = {
    title: String(formData.get("title") ?? "").trim(),
    pages: Number(formData.get("pages")),
    printerId: Number(formData.get("printerId")),
  };

  const response = await apiFetch("/print-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status !== 201) return;

  const created: PrintRequest = await response.json();
  redirect(`/print-requests/${created.id}`);
}

export default async function NewPrintRequestPage() {
  const response = await apiFetch("/printers");
  const printers: Printer[] = response.ok ? await response.json() : [];

  return (
    <main>
      <h1>Nueva solicitud</h1>
      <Link href="/print-requests">Volver al listado</Link>
      <form className="panel fields" action={createPrintRequest}>
        <label>Título del documento<input name="title" maxLength={100} required /></label>
        <label>Páginas<input name="pages" type="number" min={1} step={1} required /></label>
        <label>
          Impresora
          <select name="printerId" defaultValue="" required>
            <option value="" disabled>Seleccionar una impresora</option>
            {printers.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}{printer.isAvailable ? " — disponible" : " — fuera de servicio"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Enviar solicitud</button>
      </form>
    </main>
  );
}