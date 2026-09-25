import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPublicListing } from "@/lib/listings";
import { ListingDetail } from "@/components/ListingDetail";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
}: PageProps<"/listing/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();

  const listing = await getPublicListing(id, user?.id ?? null);
  if (!listing) notFound();

  return (
    <ListingDetail
      listing={{
        ...listing,
        createdAt: listing.createdAt.toISOString(),
      }}
      isLoggedIn={Boolean(user)}
    />
  );
}
