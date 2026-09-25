import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { MessageThread } from "@/components/MessageThread";
import { BOOKING_STATUS_STYLE } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HostBookingPage({
  params,
}: PageProps<"/host/bookings/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      listing: true,
      guest: { select: { id: true, name: true } },
    },
  });
  if (!booking || booking.listing.hostId !== user.id) notFound();

  const previousStays = await prisma.booking.count({
    where: {
      guestId: booking.guestId,
      listing: { hostId: user.id },
      status: { in: ["CONFIRMED", "COMPLETED"] },
      id: { not: booking.id },
    },
  });

  const messages = await prisma.message.findMany({
    where: { bookingId: id },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const status = BOOKING_STATUS_STYLE[booking.status] ?? BOOKING_STATUS_STYLE.PENDING;

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/host/listing/${booking.listing.id}/bookings`}
            className="text-sm font-medium text-muted"
          >
            ← Bookings
          </Link>
          <Logo size={30} />
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
          >
            {status.label}
          </span>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10 font-serif text-lg font-bold text-teal">
              {booking.guest.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="font-serif text-xl font-semibold text-foreground">
                {booking.guest.name}
              </div>
              <div className="text-xs text-muted">
                Guest · {previousStays}{" "}
                {previousStays === 1 ? "previous stay" : "previous stays"}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">
            {booking.listing.title} ·{" "}
            {booking.checkIn.toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
            })}
            –
            {booking.checkOut.toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatNaira(booking.totalPrice)} total
          </p>
        </div>

        <div className="mt-4">
          <div className="mb-2 px-1 text-[13px] font-semibold text-foreground">
            Messages
          </div>
          <MessageThread
            bookingId={booking.id}
            currentUserId={user.id}
            otherPartyName={booking.guest.name}
            initialMessages={messages.map((m) => ({
              ...m,
              createdAt: m.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
