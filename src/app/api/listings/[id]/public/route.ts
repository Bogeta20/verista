import { getCurrentUser } from "@/lib/auth";
import { getPublicListing } from "@/lib/listings";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/listings/[id]/public">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();

  const listing = await getPublicListing(id, user?.id ?? null);
  if (!listing) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  return Response.json({ listing });
}
