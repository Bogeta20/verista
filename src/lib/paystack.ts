import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

export type PaystackBank = { name: string; code: string };

export async function listNigerianBanks(): Promise<PaystackBank[]> {
  const res = await fetch(`${PAYSTACK_BASE}/bank?currency=NGN`, {
    headers: authHeaders(),
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Paystack bank list failed: ${res.status}`);
  const body = await res.json();
  return (body.data as Array<{ name: string; code: string }>).map((b) => ({
    name: b.name,
    code: b.code,
  }));
}

export async function createSubaccount({
  businessName,
  bankCode,
  accountNumber,
}: {
  businessName: string;
  bankCode: string;
  accountNumber: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/subaccount`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      business_name: businessName,
      settlement_bank: bankCode,
      account_number: accountNumber,
      percentage_charge: 0, // Verista computes and passes the exact split per transaction instead
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || `Paystack subaccount creation failed: ${res.status}`);
  }
  return body.data.subaccount_code as string;
}

export async function initializeTransaction({
  email,
  amountKobo,
  subaccountCode,
  platformShareKobo,
  reference,
  callbackUrl,
  metadata,
}: {
  email: string;
  amountKobo: number;
  subaccountCode: string;
  platformShareKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      subaccount: subaccountCode,
      transaction_charge: platformShareKobo,
      bearer: "subaccount",
      metadata,
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || `Paystack transaction init failed: ${res.status}`);
  }
  return {
    authorizationUrl: body.data.authorization_url as string,
    accessCode: body.data.access_code as string,
    reference: body.data.reference as string,
  };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
