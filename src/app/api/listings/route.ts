import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingCreateSchema } from "@/lib/validation";

const PUBLIC_LISTING_SELECT = {
  id: true,
  title: true,
  area: true,
  pricePerNight: true,
  amenities: true,
  photos: true,
  createdAt: true,
  services: { select: { id: true } },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area")?.trim();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const hasDateRange = Boolean(checkIn && checkOut);
  const checkInDate = hasDateRange ? new Date(checkIn as string) : null;
  const checkOutDate = hasDateRange ? new Date(checkOut as string) : null;

  if (
    hasDateRange &&
    (Number.isNaN(checkInDate!.getTime()) ||
      Number.isNaN(checkOutDate!.getTime()) ||
      checkOutDate! <= checkInDate!)
  ) {
    return Response.json({ error: "Invalid date range" }, { status: 400 });
  }

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(area && { area: { equals: area, mode: "insensitive" } }),
      ...(hasDateRange && {
        bookings: {
          none: {
            status: { in: ["PENDING", "CONFIRMED"] },
            checkIn: { lt: checkOutDate as Date },
            checkOut: { gt: checkInDate as Date },
          },
        },
      }),
    },
    select: PUBLIC_LISTING_SELECT,
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ listings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const payout = await prisma.hostPayoutInfo.findUnique({
    where: { hostId: user.id },
  });
  if (!payout) {
    return Response.json(
      { error: "Add your payout details before creating a listing" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = listingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { title, description, area, pricePerNightNaira, houseRules, amenities } =
    parsed.data;

  const listing = await prisma.listing.create({
    data: {
      hostId: user.id,
      title,
      description,
      area,
      pricePerNight: pricePerNightNaira * 100,
      houseRules: houseRules || null,
      amenities,
      status: "INACTIVE",
    },
  });

  return Response.json({ listing }, { status: 201 });
}
