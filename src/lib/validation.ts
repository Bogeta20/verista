import { z } from "zod";
import { AMENITY_KEYS } from "@/lib/constants";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["GUEST", "HOST", "BOTH"]),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const payoutSchema = z.object({
  bankName: z.string().trim().min(2, "Enter your bank name").max(80),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a 10-digit account number"),
});

const amenitiesShape = z
  .array(z.string())
  .refine((arr) => arr.every((a) => (AMENITY_KEYS as string[]).includes(a)), {
    message: "Unknown amenity",
  });

export const listingCreateSchema = z.object({
  title: z.string().trim().min(3, "Give the listing a title").max(120),
  description: z.string().trim().min(10, "Add a short description").max(2000),
  area: z.string().trim().min(2, "Enter the area, e.g. Lekki").max(60),
  pricePerNightNaira: z
    .number({ error: "Enter a nightly price" })
    .int()
    .positive()
    .max(10_000_000),
  houseRules: z.string().trim().max(2000).optional().or(z.literal("")),
  amenities: amenitiesShape.default([]),
});

export const listingUpdateSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(2000),
    area: z.string().trim().min(2).max(60),
    pricePerNightNaira: z.number().int().positive().max(10_000_000),
    houseRules: z.string().trim().max(2000).nullable(),
    amenities: amenitiesShape,
    photos: z.array(z.string().url()).max(20),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update",
  });

export const serviceCreateSchema = z.object({
  category: z.enum(["CHEF", "DRIVER", "FUEL_TOPUP", "CLEANING", "CUSTOM"]),
  name: z.string().trim().min(2, "Name this service").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  priceNaira: z
    .number({ error: "Enter a price" })
    .int()
    .positive()
    .max(1_000_000),
  priceType: z.enum(["per_day", "per_trip", "per_stay", "per_visit"]),
});

export const serviceUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(500).nullable(),
    priceNaira: z.number().int().positive().max(1_000_000),
    priceType: z.enum(["per_day", "per_trip", "per_stay", "per_visit"]),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update",
  });
