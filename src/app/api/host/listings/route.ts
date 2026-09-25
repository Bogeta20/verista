import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const listings = await prisma.listing.findMany({
    where: { hostId: user.id },
    include: { services: true, _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ listings });
}
