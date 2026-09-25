import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceCreateSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/listings/[id]/services">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const services = await prisma.service.findMany({
    where: { listingId: id },
    orderBy: { id: "asc" },
  });
  return Response.json({ services });
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/listings/[id]/services">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = serviceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { category, name, description, priceNaira, priceType } = parsed.data;

  const service = await prisma.service.create({
    data: {
      listingId: id,
      category,
      name,
      description: description || null,
      price: priceNaira * 100,
      priceType,
    },
  });

  return Response.json({ service }, { status: 201 });
}
