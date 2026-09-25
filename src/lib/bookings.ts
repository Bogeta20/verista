import { prisma } from "@/lib/prisma";

export async function getMessageableBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { select: { id: true, title: true, hostId: true } },
      guest: { select: { id: true, name: true } },
    },
  });

  if (!booking) return null;
  if (booking.guestId !== userId && booking.listing.hostId !== userId) {
    return null;
  }

  return booking;
}
