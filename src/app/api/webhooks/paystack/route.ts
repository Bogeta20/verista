import { prisma } from "@/lib/prisma";
import { isPaystackConfigured, verifyWebhookSignature } from "@/lib/paystack";

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return Response.json({ error: "Payments aren't configured" }, { status: 501 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const data = event.data;
    const reference = data?.reference as string | undefined;
    if (reference) {
      const booking = await prisma.booking.findFirst({
        where: { paymentReference: reference },
      });

      if (
        booking &&
        booking.status === "PENDING" &&
        data.status === "success" &&
        data.amount === booking.totalPrice
      ) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "CONFIRMED" },
        });
      }
    }
  }

  return Response.json({ received: true });
}
