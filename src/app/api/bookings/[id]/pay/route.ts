import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPaystackConfigured, initializeTransaction } from "@/lib/paystack";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]/pay">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  if (!isPaystackConfigured()) {
    return Response.json(
      {
        error:
          "Payments aren't configured yet — PAYSTACK_SECRET_KEY is missing.",
      },
      { status: 501 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { listing: { include: { host: { include: { payoutInfo: true } } } } },
  });
  if (!booking || booking.guestId !== user.id) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.status !== "PENDING") {
    return Response.json(
      { error: "This booking isn't awaiting payment" },
      { status: 400 }
    );
  }

  const subaccountCode = booking.listing.host.payoutInfo?.paystackSubaccountCode;
  if (!subaccountCode || subaccountCode.startsWith("ACCTSTUB_")) {
    return Response.json(
      { error: "This host's payout account isn't set up with Paystack yet" },
      { status: 400 }
    );
  }

  const reference = `verista_${booking.id}_${randomUUID().slice(0, 8)}`;
  const platformShareKobo = booking.totalPrice - booking.hostPayout;

  const body = await request.json().catch(() => ({}));
  const origin = new URL(request.url).origin;
  const callbackUrl =
    typeof body?.callbackUrl === "string"
      ? body.callbackUrl
      : `${origin}/bookings/${booking.id}`;

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: user.email,
      amountKobo: booking.totalPrice,
      subaccountCode,
      platformShareKobo,
      reference,
      callbackUrl,
      metadata: { bookingId: booking.id },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentReference: reference },
    });

    return Response.json({ authorizationUrl });
  } catch (error) {
    return Response.json(
      { error: `Couldn't start payment: ${(error as Error).message}` },
      { status: 502 }
    );
  }
}
