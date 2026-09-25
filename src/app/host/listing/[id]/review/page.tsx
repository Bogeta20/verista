import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { PublishButton } from "@/components/PublishButton";
import { AMENITIES } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ListingReviewPage({
  params,
}: PageProps<"/host/listing/[id]/review">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { services: true },
  });
  if (!listing || listing.hostId !== user.id) notFound();

  const amenityLabels = listing.amenities
    .map((key) => AMENITIES.find((a) => a.key === key)?.label ?? key)
    .filter(Boolean);

  return (
    <HostStepShell
      backHref={`/host/listing/${id}/photos`}
      step="Step 5 of 5"
      title="Review & publish"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div
          className="h-[140px]"
          style={{
            background: listing.photos[0] ? undefined : "#F1DCC9",
            backgroundImage: listing.photos[0]
              ? `url(${listing.photos[0]})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="p-4">
          <div className="text-[15px] font-semibold text-foreground">
            {listing.title}
          </div>
          <div className="mt-0.5 text-[13px] text-muted">{listing.area}</div>
          <div className="mt-1.5 text-[15px] font-bold text-foreground">
            {formatNaira(listing.pricePerNight)}{" "}
            <span className="text-[13px] font-normal text-muted">
              / night
            </span>
          </div>
          {amenityLabels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {amenityLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-semibold text-accent"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        This is exactly what guests will see. You can edit anything after
        publishing too.
      </p>

      <Link
        href={`/host/listing/${id}/services`}
        className="mt-4 flex items-center gap-2.5 rounded-xl border border-border bg-white p-3.5"
      >
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground">
            {listing.services.length}{" "}
            {listing.services.length === 1 ? "service" : "services"} added
          </div>
          {listing.services.length > 0 && (
            <div className="mt-0.5 text-[11px] text-muted">
              {listing.services.map((s) => s.name).join(", ")}
            </div>
          )}
        </div>
        <span className="text-xs font-bold text-accent">Edit</span>
      </Link>

      <PublishButton listingId={id} />
    </HostStepShell>
  );
}
