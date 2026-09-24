import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDbStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true as const };
  } catch (error) {
    return { connected: false as const, message: (error as Error).message };
  }
}

export default async function Home() {
  const db = await getDbStatus();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 sm:px-6 sm:py-16">
      <main className="flex w-full max-w-sm flex-col gap-6 sm:max-w-2xl">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">
            Verista
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Short-let apartments in Lagos — booked, paid for, and confirmed
            online.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-900">
            Project scaffold
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 sm:flex-col sm:items-start sm:gap-1">
              <dt className="text-xs text-zinc-500">Database</dt>
              <dd
                className={`text-sm font-medium ${
                  db.connected ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {db.connected ? "Connected" : "Unreachable"}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 sm:flex-col sm:items-start sm:gap-1">
              <dt className="text-xs text-zinc-500">API</dt>
              <dd className="text-sm font-medium text-emerald-700">
                <a href="/api/health" className="underline">
                  /api/health
                </a>
              </dd>
            </div>
          </dl>
          {!db.connected && (
            <p className="mt-3 text-xs text-red-700">{db.message}</p>
          )}
        </section>
      </main>
    </div>
  );
}
