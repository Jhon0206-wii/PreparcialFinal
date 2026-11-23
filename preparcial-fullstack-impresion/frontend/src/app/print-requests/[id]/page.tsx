import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import type { PrintRequest } from "../../../lib/print-types";

type DetailPageProps = { params: Promise<{ id: string }> };

export default async function PrintRequestDetailPage({
  params,
}: DetailPageProps) {
  const { id } = await params;
  const response = await apiFetch(`/print-requests/${id}`);
  if (!response.ok) notFound();

  const request: PrintRequest = await response.json();

  return (
    <main>
      <h1>Comprobante</h1>
      <Link href="/print-requests">Volver al listado</Link>
      <section className="panel" aria-label="Detalle de la solicitud">
        <dl>
          <dt>ID</dt>
          <dd>{request.id}</dd>
          <dt>Título</dt>
          <dd>{request.title}</dd>
          <dt>Páginas</dt>
          <dd>{request.pages}</dd>
          <dt>Impresora</dt>
          <dd>{request.printer.name}</dd>
          <dt>Estado</dt>
          <dd>{request.status === "pending" ? "Pendiente" : "Impresa"}</dd>
        </dl>
      </section>
    </main>
  );
}
