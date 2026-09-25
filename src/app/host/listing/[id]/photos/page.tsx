import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostStepShell } from "@/components/HostStepShell";
import { PhotosUploader } from "@/components/PhotosUploader";
import { primaryButtonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ListingPhotosPage({
  params,
}: PageProps<"/host/listing/[id]/photos">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) notFound();

  return (
    <HostStepShell
      backHref={`/host/listing/${id}/services`}
      step="Step 4 of 5"
      title="Upload photos"
      subtitle="At least 3 photos — listings with more photos get booked faster."
    >
      <PhotosUploader listingId={id} initialPhotos={listing.photos} />

      <Link
        href={`/host/listing/${id}/review`}
        className={`${primaryButtonClass} mt-6`}
      >
        Continue
      </Link>
    </HostStepShell>
  );
}
