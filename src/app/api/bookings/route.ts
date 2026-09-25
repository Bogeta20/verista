import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingCreateSchema } from "@/lib/validation";
import { nightsBetween, computeBookingPrice } from "@/lib/pricing";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { listingId, guestCount, serviceIds } = parsed.data;
  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { services: true },
  });
  if (!listing || listing.status !== "ACTIVE") {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const selectedServices = listing.services.filter((s) =>
    serviceIds.includes(s.id)
  );
  if (selectedServices.length !== serviceIds.length) {
    return Response.json(
      { error: "One or more services don't belong to this listing" },
      { status: 400 }
    );
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      listingId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });
  if (conflict) {
    return Response.json(
      { error: "This listing isn't available for those dates" },
      { status: 409 }
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const breakdown = computeBookingPrice({
    pricePerNight: listing.pricePerNight,
    nights,
    discountTiers: listing.discountTiers,
    services: selectedServices.map((s) => ({
      id: s.id,
      price: s.price,
      priceType: s.priceType,
    })),
  });

  const booking = await prisma.booking.create({
    data: {
      listingId,
      guestId: user.id,
      checkIn,
      checkOut,
      guestCount,
      totalPrice: breakdown.totalPrice,
      hostPayout: breakdown.hostPayout,
      commissionAmount: breakdown.commissionAmount,
      services: {
        create: breakdown.serviceBreakdown.map((s) => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
          totalPrice: s.totalPrice,
        })),
      },
    },
    include: { services: { include: { service: true } } },
  });

  return Response.json({ booking, breakdown }, { status: 201 });
}
