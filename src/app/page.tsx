import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";

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
    <div className="flex flex-1 justify-center px-4 py-8 sm:px-6 sm:py-12">
      <main className="flex w-full max-w-sm flex-col gap-8 sm:max-w-2xl">
        <header className="flex items-center justify-between">
          <Logo />
        </header>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Short-let apartments in Lagos
          </h1>
          <p className="text-sm text-muted sm:text-base">
            Booked, paid for, and confirmed online.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Project scaffold
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-accent-tint/40 px-4 py-3 sm:flex-col sm:items-start sm:gap-2">
              <dt className="text-xs font-medium text-muted">Database</dt>
              <dd>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    db.connected
                      ? "bg-teal/10 text-teal"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {db.connected ? "Connected" : "Unreachable"}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-accent-tint/40 px-4 py-3 sm:flex-col sm:items-start sm:gap-2">
              <dt className="text-xs font-medium text-muted">API</dt>
              <dd>
                <a
                  href="/api/health"
                  className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-accent/90"
                >
                  /api/health
                </a>
              </dd>
            </div>
          </dl>
          {!db.connected && (
            <p className="mt-3 text-xs text-accent">{db.message}</p>
          )}
        </section>
      </main>
    </div>
  );
}
