import { getCurrentUser } from "@/lib/auth";
import { isPaystackConfigured, listNigerianBanks } from "@/lib/paystack";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  if (!isPaystackConfigured()) {
    return Response.json({ configured: false, banks: [] });
  }

  try {
    const banks = await listNigerianBanks();
    return Response.json({ configured: true, banks });
  } catch (error) {
    return Response.json(
      { configured: true, banks: [], error: (error as Error).message },
      { status: 502 }
    );
  }
}
