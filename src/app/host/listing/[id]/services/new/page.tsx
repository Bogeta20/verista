import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { ServiceForm } from "@/components/ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage({
  params,
}: PageProps<"/host/listing/[id]/services/new">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) notFound();

  return (
    <HostStepShell backHref={`/host/listing/${id}/services`} title="Add a service">
      <ServiceForm listingId={id} />
    </HostStepShell>
  );
}
