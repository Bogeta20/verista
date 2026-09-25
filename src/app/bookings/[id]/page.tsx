import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { nightsBetween, computeBookingPrice } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending payment", className: "bg-accent-tint text-accent" },
  CONFIRMED: { label: "Confirmed", className: "bg-teal/10 text-teal" },
  CANCELLED: { label: "Cancelled", className: "bg-border/60 text-muted" },
  COMPLETED: { label: "Completed", className: "bg-teal/10 text-teal" },
};

export default async function BookingPage({
  params,
}: PageProps<"/bookings/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      listing: { include: { host: { select: { name: true } } } },
      services: { include: { service: true } },
    },
  });
  if (!booking || booking.guestId !== user.id) notFound();

  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const breakdown = computeBookingPrice({
    pricePerNight: booking.listing.pricePerNight,
    nights,
    discountTiers: booking.listing.discountTiers,
    services: booking.services.map((bs) => ({
      id: bs.service.id,
      price: bs.service.price,
      priceType: bs.service.priceType,
    })),
  });

  const status = STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING;

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-muted">
            ← Back home
          </Link>
          <Logo size={30} />
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
          >
            {status.label}
          </span>

          <h1 className="mt-3 font-serif text-2xl font-semibold text-foreground">
            {booking.listing.title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {booking.listing.area} · Hosted by {booking.listing.host.name}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3.5">
              <div className="text-[11px] text-[#A69F91]">Check in</div>
              <div className="mt-0.5 text-sm font-semibold text-foreground">
                {booking.checkIn.toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border p-3.5">
              <div className="text-[11px] text-[#A69F91]">Check out</div>
              <div className="mt-0.5 text-sm font-semibold text-foreground">
                {booking.checkOut.toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted">
            {nights} night{nights === 1 ? "" : "s"} · {booking.guestCount} guest
            {booking.guestCount === 1 ? "" : "s"}
          </div>

          {booking.listing.address && booking.status === "CONFIRMED" && (
            <div className="mt-4 rounded-xl border border-teal/30 bg-teal/10 p-4">
              <div className="mb-1 text-xs font-semibold text-teal">
                Address
              </div>
              <div className="text-[13px] leading-relaxed text-foreground">
                {booking.listing.address}
              </div>
              {booking.listing.accessNotes && (
                <div className="mt-2 text-[13px] leading-relaxed text-muted">
                  {booking.listing.accessNotes}
                </div>
              )}
            </div>
          )}

          <div className="mt-5 border-t border-border pt-5">
            <div className="mb-3 text-[13px] font-semibold text-foreground">
              Price breakdown
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  {formatNaira(booking.listing.pricePerNight)} × {nights} night
                  {nights === 1 ? "" : "s"}
                </span>
                <span className="text-foreground">
                  {formatNaira(breakdown.nightlySubtotal)}
                </span>
              </div>
              {breakdown.discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">
                    {breakdown.discountPercent}% long-stay discount
                  </span>
                  <span className="text-teal">
                    -{formatNaira(breakdown.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted">HORC tax (5%)</span>
                <span className="text-foreground">
                  {formatNaira(breakdown.horcTax)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">VAT (7.5%)</span>
                <span className="text-foreground">
                  {formatNaira(breakdown.vat)}
                </span>
              </div>
              {breakdown.servicesTotal > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">Extras</span>
                  <span className="text-foreground">
                    {formatNaira(breakdown.servicesTotal)}
                  </span>
                </div>
              )}
              <div className="mt-1.5 flex items-center justify-between border-t border-border pt-2.5 text-sm font-bold text-foreground">
                <span>Total</span>
                <span>{formatNaira(booking.totalPrice)}</span>
              </div>
            </div>
          </div>

          {booking.status === "PENDING" && (
            <p className="mt-5 rounded-xl bg-accent-tint px-4 py-3 text-[13px] leading-relaxed text-foreground">
              This booking is saved and pending payment. It will be confirmed
              once payment is set up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
