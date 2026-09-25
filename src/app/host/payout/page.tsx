import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { PayoutForm } from "@/components/PayoutForm";

export const dynamic = "force-dynamic";

export default async function HostPayoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const payout = await prisma.hostPayoutInfo.findUnique({
    where: { hostId: user.id },
  });

  return (
    <HostStepShell
      backHref="/become-host"
      step="Step 1 of 5"
      title="Add payout details"
      subtitle="Where should Verista send your earnings?"
    >
      <PayoutForm
        initialBankName={payout?.bankName ?? ""}
        initialBankCode={payout?.bankCode ?? ""}
        initialAccountNumber={payout?.accountNumber ?? ""}
      />
    </HostStepShell>
  );
}
