import { z } from "zod";

export const districtSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameMarathi: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type District = z.infer<typeof districtSchema>;

export const monthlyDataSchema = z.object({
  month: z.string(),
  monthMarathi: z.string(),
  peopleBenefited: z.number(),
  personDays: z.number(),
  wagesPaid: z.number(),
  year: z.number().optional(),
});

export type MonthlyData = z.infer<typeof monthlyDataSchema>;

export const yearlyDataSchema = z.object({
  year: z.number(),
  totalPeopleBenefited: z.number(),
  totalPersonDays: z.number(),
  totalWagesPaid: z.number(),
  monthlyData: z.array(monthlyDataSchema),
});

export type YearlyData = z.infer<typeof yearlyDataSchema>;

export const mgneregaDataSchema = z.object({
  district: z.string(),
  districtMarathi: z.string(),
  totalPeopleBenefited: z.number(),
  totalPersonDays: z.number(),
  totalWagesPaid: z.number(),
  lastUpdated: z.string(),
  monthlyData: z.array(monthlyDataSchema),
  historicalData: z.array(yearlyDataSchema).optional(),
});

export type MGNEREGAData = z.infer<typeof mgneregaDataSchema>;

export const districtListSchema = z.array(districtSchema);
export type DistrictList = z.infer<typeof districtListSchema>;
