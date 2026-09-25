export const AMENITIES = [
  { key: "wifi", label: "Wifi" },
  { key: "grid", label: "Grid" },
  { key: "powergrid", label: "Power grid" },
  { key: "pool", label: "Pool" },
  { key: "ac", label: "AC" },
  { key: "parking", label: "Parking" },
  { key: "security", label: "Security" },
  { key: "borehole", label: "Borehole water" },
  { key: "kitchen", label: "Kitchen" },
  { key: "washer", label: "Washing machine" },
  { key: "tv", label: "TV / Netflix" },
] as const;

export const AMENITY_KEYS = AMENITIES.map((a) => a.key);

export const SERVICE_CATEGORIES = {
  CHEF: {
    label: "Chef",
    defaultName: "In-house Chef",
    priceType: "per_day",
    unitLabel: "Per day",
    min: 8000,
    max: 20000,
  },
  DRIVER: {
    label: "Driver",
    defaultName: "Airport Pickup / Driver",
    priceType: "per_trip",
    unitLabel: "Per trip",
    min: 5000,
    max: 15000,
  },
  FUEL_TOPUP: {
    label: "Fuel Top-up",
    defaultName: "Generator Fuel Top-up",
    priceType: "per_stay",
    unitLabel: "Per stay",
    min: 3000,
    max: 12000,
  },
  CLEANING: {
    label: "Cleaning",
    defaultName: "Mid-stay Cleaning",
    priceType: "per_visit",
    unitLabel: "Per visit",
    min: 5000,
    max: 15000,
  },
  CUSTOM: {
    label: "Custom",
    defaultName: "Custom service",
    priceType: "per_stay",
    unitLabel: "Per stay",
    min: null,
    max: null,
  },
} as const;

export type ServiceCategoryKey = keyof typeof SERVICE_CATEGORIES;

export const PRICE_TYPE_LABELS: Record<string, string> = {
  per_day: "Per day",
  per_trip: "Per trip",
  per_stay: "Per stay",
  per_visit: "Per visit",
};

// Lagos State Hotel Occupancy & Restaurant Consumption tax, and standard
// Nigerian VAT — applied to the accommodation subtotal (after any
// discount), not to add-on services.
export const HORC_TAX_RATE = 0.05;
export const VAT_RATE = 0.075;

// Verista's take of each booking's accommodation total. Not specified in
// the original brief — flag if this should be a different number.
export const HOST_COMMISSION_RATE = 0.12;

export const BOOKING_STATUS_STYLE: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending payment", className: "bg-accent-tint text-accent" },
  CONFIRMED: { label: "Confirmed", className: "bg-teal/10 text-teal" },
  CANCELLED: { label: "Cancelled", className: "bg-border/60 text-muted" },
  COMPLETED: { label: "Completed", className: "bg-teal/10 text-teal" },
};
