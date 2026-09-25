import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { BOOKING_STATUS_STYLE } from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import { toneForId } from "@/lib/tone";

export const dynamic = "force-dynamic";

export default async function HostBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { listing: { hostId: user.id } },
    include: { listing: true, guest: { select: { name: true } } },
    orderBy: { checkIn: "desc" },
  });

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[560px]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            All bookings
          </h1>
          <Link href="/host/dashboard">
            <Logo size={30} />
          </Link>
        </div>
        <Link
          href="/host/dashboard"
          className="mt-1 inline-block text-sm font-medium text-muted"
        >
          ← Your listings
        </Link>

        <div className="mt-5 flex flex-col gap-4">
          {bookings.map((booking) => {
            const status =
              BOOKING_STATUS_STYLE[booking.status] ?? BOOKING_STATUS_STYLE.PENDING;
            const photo = booking.listing.photos[0];
            return (
              <Link
                key={booking.id}
                href={`/host/bookings/${booking.id}`}
                className="flex gap-3 overflow-hidden rounded-2xl border border-border bg-white p-3"
              >
                <div
                  className="h-[76px] w-[76px] shrink-0 rounded-xl"
                  style={{
                    background: photo ? undefined : toneForId(booking.listing.id),
                    backgroundImage: photo ? `url(${photo})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[15px] font-semibold text-foreground">
                        {booking.guest.name}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[13px] text-muted">
                      {booking.listing.title}
                    </div>
                  </div>
                  <div className="text-[13px] text-muted">
                    {booking.checkIn.toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                    –
                    {booking.checkOut.toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {formatNaira(booking.totalPrice)}
                  </div>
                </div>
              </Link>
            );
          })}

          {bookings.length === 0 && (
            <p className="text-sm text-muted">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
