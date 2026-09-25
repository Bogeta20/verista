import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceUpdateSchema } from "@/lib/validation";

async function findOwnedService(id: string, hostId: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { listing: true },
  });
  if (!service || service.listing.hostId !== hostId) return null;
  return service;
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/services/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const existing = await findOwnedService(id, user.id);
  if (!existing) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { priceNaira, ...rest } = parsed.data;

  const service = await prisma.service.update({
    where: { id },
    data: {
      ...rest,
      ...(priceNaira !== undefined && { price: priceNaira * 100 }),
    },
  });

  return Response.json({ service });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/services/[id]">
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const existing = await findOwnedService(id, user.id);
  if (!existing) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id } });
  return Response.json({ ok: true });
}
