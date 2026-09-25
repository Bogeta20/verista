import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingCreateSchema } from "@/lib/validation";

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
