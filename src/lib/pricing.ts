import { HORC_TAX_RATE, VAT_RATE, HOST_COMMISSION_RATE } from "@/lib/constants";

export function nightsBetween(checkIn: Date, checkOut: Date) {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

type DiscountTier = { minNights: number; percentOff: number };

function parseDiscountTiers(raw: unknown): DiscountTier[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t): t is DiscountTier =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as DiscountTier).minNights === "number" &&
      typeof (t as DiscountTier).percentOff === "number"
  );
}

export function resolveDiscountPercent(nights: number, discountTiers: unknown) {
  const tiers = parseDiscountTiers(discountTiers).filter(
    (t) => nights >= t.minNights
  );
  if (tiers.length === 0) return 0;
  return Math.max(...tiers.map((t) => t.percentOff));
}

export type SelectedServiceInput = {
  id: string;
  price: number; // kobo
  priceType: string;
};

export function computeBookingPrice({
  pricePerNight,
  nights,
  discountTiers,
  services,
}: {
  pricePerNight: number; // kobo
  nights: number;
  discountTiers: unknown;
  services: SelectedServiceInput[];
}) {
  const nightlySubtotal = pricePerNight * nights;
  const discountPercent = resolveDiscountPercent(nights, discountTiers);
  const discountAmount = Math.round((nightlySubtotal * discountPercent) / 100);
  const accommodationSubtotal = nightlySubtotal - discountAmount;

  const horcTax = Math.round(accommodationSubtotal * HORC_TAX_RATE);
  const vat = Math.round(accommodationSubtotal * VAT_RATE);
  const taxTotal = horcTax + vat;

  const serviceBreakdown = services.map((service) => {
    const quantity = service.priceType === "per_day" ? nights : 1;
    return {
      serviceId: service.id,
      quantity,
      totalPrice: service.price * quantity,
    };
  });
  const servicesTotal = serviceBreakdown.reduce((sum, s) => sum + s.totalPrice, 0);

  const totalPrice = accommodationSubtotal + taxTotal + servicesTotal;
  const commissionAmount = Math.round(accommodationSubtotal * HOST_COMMISSION_RATE);
  const hostPayout = accommodationSubtotal - commissionAmount + servicesTotal;

  return {
    nights,
    nightlySubtotal,
    discountPercent,
    discountAmount,
    accommodationSubtotal,
    horcTax,
    vat,
    taxTotal,
    serviceBreakdown,
    servicesTotal,
    totalPrice,
    commissionAmount,
    hostPayout,
  };
}
