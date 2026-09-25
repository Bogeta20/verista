import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/listings/[id]/bookings">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const bookings = await prisma.booking.findMany({
    where: { listingId: id },
    include: { guest: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ bookings });
}
