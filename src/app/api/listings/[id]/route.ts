import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingUpdateSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/listings/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { services: true },
  });
  if (!listing || listing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  return Response.json({ listing });
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/listings/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing || existing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = listingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { pricePerNightNaira, ...rest } = parsed.data;

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      ...rest,
      ...(pricePerNightNaira !== undefined && {
        pricePerNight: pricePerNightNaira * 100,
      }),
    },
  });

  return Response.json({ listing });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/listings/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing || existing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  await prisma.listing.delete({ where: { id } });
  return Response.json({ ok: true });
}
