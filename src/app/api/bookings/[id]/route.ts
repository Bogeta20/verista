import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      listing: { include: { host: { select: { name: true } } } },
      services: { include: { service: true } },
    },
  });

  if (!booking || booking.guestId !== user.id) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  return Response.json({ booking });
}
