import { getCurrentUser } from "@/lib/auth";
import { getMessageableBooking } from "@/lib/bookings";
import { prisma } from "@/lib/prisma";
import { messageCreateSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/bookings/[id]/messages">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const booking = await getMessageableBooking(id, user.id);
  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { bookingId: id },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ messages });
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]/messages">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const booking = await getMessageableBooking(id, user.id);
  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = messageCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      bookingId: id,
      senderId: user.id,
      content: parsed.data.content,
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  return Response.json({ message }, { status: 201 });
}
