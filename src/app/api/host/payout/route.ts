import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { payoutSchema } from "@/lib/validation";
import { isPaystackConfigured, createSubaccount } from "@/lib/paystack";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const payout = await prisma.hostPayoutInfo.findUnique({
    where: { hostId: user.id },
  });
  return Response.json({ payout });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = payoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { bankName, bankCode, accountNumber } = parsed.data;

  const existing = await prisma.hostPayoutInfo.findUnique({
    where: { hostId: user.id },
  });

  let paystackSubaccountCode = existing?.paystackSubaccountCode ?? null;

  if (!existing) {
    if (isPaystackConfigured() && bankCode) {
      try {
        paystackSubaccountCode = await createSubaccount({
          businessName: user.name,
          bankCode,
          accountNumber,
        });
      } catch (error) {
        return Response.json(
          {
            error: `Couldn't verify your bank details with Paystack: ${(error as Error).message}`,
          },
          { status: 502 }
        );
      }
    } else {
      // No Paystack keys yet (or no bank code resolved) — keep hosting
      // usable with a stub, per the original instruction to ask before
      // steps that need real credentials.
      paystackSubaccountCode = `ACCTSTUB_${Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase()}`;
    }
  }

  const payout = await prisma.hostPayoutInfo.upsert({
    where: { hostId: user.id },
    create: {
      hostId: user.id,
      bankName,
      bankCode: bankCode || null,
      accountNumber,
      paystackSubaccountCode,
    },
    update: { bankName, bankCode: bankCode || null, accountNumber },
  });

  if (user.role === "GUEST") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "BOTH" },
    });
  }

  return Response.json({ payout }, { status: 201 });
}
