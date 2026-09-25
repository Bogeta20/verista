import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { ListingForm } from "@/components/ListingForm";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const payout = await prisma.hostPayoutInfo.findUnique({
    where: { hostId: user.id },
  });
  if (!payout) redirect("/host/payout");

  return (
    <HostStepShell
      backHref="/host/payout"
      step="Step 2 of 5"
      title="Create the listing"
    >
      <ListingForm />
    </HostStepShell>
  );
}
