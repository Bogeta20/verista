import { prisma } from "@/lib/prisma";

export async function getPublicListing(id: string, viewerUserId: string | null) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      services: true,
      host: { select: { name: true } },
    },
  });

  if (!listing || listing.status !== "ACTIVE") return null;

  let hasConfirmedBooking = false;
  if (viewerUserId) {
    const confirmed = await prisma.booking.findFirst({
      where: {
        listingId: id,
        guestId: viewerUserId,
        status: "CONFIRMED",
      },
      select: { id: true },
    });
    hasConfirmedBooking = Boolean(confirmed);
  }

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    area: listing.area,
    latitude: listing.latitude,
    longitude: listing.longitude,
    houseRules: listing.houseRules,
    pricePerNight: listing.pricePerNight,
    amenities: listing.amenities,
    discountTiers: listing.discountTiers,
    photos: listing.photos,
    status: listing.status,
    createdAt: listing.createdAt,
    services: listing.services,
    hostName: listing.host.name,
    address: hasConfirmedBooking ? listing.address : null,
    accessNotes: hasConfirmedBooking ? listing.accessNotes : null,
  };
}
