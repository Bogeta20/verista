import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { payoutSchema } from "@/lib/validation";

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

  const { bankName, accountNumber } = parsed.data;

  // Stubbed Paystack Subaccount creation — swapped for the real API call
  // once test keys are wired up in a later stage.
  const paystackSubaccountCode = `ACCTSTUB_${Math.random()
    .toString(36)
    .slice(2, 10)
    .toUpperCase()}`;

  const payout = await prisma.hostPayoutInfo.upsert({
    where: { hostId: user.id },
    create: { hostId: user.id, bankName, accountNumber, paystackSubaccountCode },
    update: { bankName, accountNumber },
  });

  if (user.role === "GUEST") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "BOTH" },
    });
  }

  return Response.json({ payout }, { status: 201 });
}
