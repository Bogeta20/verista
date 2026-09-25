import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import {
  hashPassword,
  publicUserSelect,
  sessionCookieOptions,
  signSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, phone, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash, role },
    select: publicUserSelect,
  });

  const token = signSessionToken({ sub: user.id, role: user.role });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  return Response.json({ user }, { status: 201 });
}
