import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { ServiceIcon } from "@/components/ServiceIcon";
import { PRICE_TYPE_LABELS } from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import { primaryButtonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ListingServicesPage({
  params,
}: PageProps<"/host/listing/[id]/services">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { services: { orderBy: { id: "asc" } } },
  });
  if (!listing || listing.hostId !== user.id) notFound();

  return (
    <HostStepShell
      backHref="/host/listing/new"
      step="Step 3 of 5"
      title="Offer any extras?"
      subtitle="Optional — chef, driver, fuel top-up, or anything else guests could book alongside your place."
    >
      <div className="flex flex-col gap-2.5">
        {listing.services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5"
          >
            <ServiceIcon category={service.category} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">
                {service.name}
              </div>
              <div className="mt-0.5 text-xs text-muted">
                {PRICE_TYPE_LABELS[service.priceType] ?? service.priceType}
              </div>
            </div>
            <div className="text-sm font-bold text-foreground">
              {formatNaira(service.price)}
            </div>
          </div>
        ))}

        <Link
          href={`/host/listing/${id}/services/new`}
          className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-border p-4 text-muted"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-sm font-semibold">Add a service</span>
        </Link>
      </div>

      <Link
        href={`/host/listing/${id}/photos`}
        className={`${primaryButtonClass} mt-6`}
      >
        Continue
      </Link>
    </HostStepShell>
  );
}
