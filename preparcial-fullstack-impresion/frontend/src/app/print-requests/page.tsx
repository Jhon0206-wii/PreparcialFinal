import Link from "next/link";
import { redirect } from "next/navigation";
import { apiFetch } from "../../lib/api";
import type { PrintRequest } from "../../lib/print-types";
import { clearSessionToken } from "../../lib/session";

async function logout() {
  "use server";
  await clearSessionToken();
  redirect("/login");
}

type PrintRequestsPageProps = { searchParams: Promise<{ status?: string }> };

export default async function PrintRequestsPage({ searchParams }: PrintRequestsPageProps) {
  const { status } = await searchParams;
  const filter = status === "pending" ? "pending" : undefined;

  const response = await apiFetch(`/print-requests${filter ? `?status=${filter}` : ""}`);
  const requests: PrintRequest[] = response.ok ? await response.json() : [];

  return (
    <main>
      <h1>Solicitudes de impresión</h1>
      <div className="actions">
        <Link className="button" href="/print-requests/new">Nueva solicitud</Link>
        <form action={logout}><button type="submit">Cerrar sesión</button></form>
      </div>
      <nav className="actions" aria-label="Filtros">
        <Link href="/print-requests">Todas</Link>
        <Link href="/print-requests?status=pending">Pendientes</Link>
      </nav>
      <section className="panel" aria-label="Solicitudes">
        <table>
          <thead>
            <tr><th>Título</th><th>Páginas</th><th>Impresora</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td><Link href={`/print-requests/${request.id}`}>{request.title}</Link></td>
                <td>{request.pages}</td>
                <td>{request.printer.name}</td>
                <td>{request.status === "pending" ? "Pendiente" : "Impresa"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}