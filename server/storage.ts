import type { District, MGNEREGAData } from "@shared/schema";
import { readFileSync } from "fs";
import { join } from "path";

export interface IStorage {
  getDistricts(): Promise<District[]>;
  getDistrictData(districtId: string): Promise<MGNEREGAData | undefined>;
  cacheDistrictData(districtId: string, data: MGNEREGAData): Promise<void>;
  getCachedDistrictData(districtId: string): Promise<MGNEREGAData | undefined>;
}

interface CacheEntry {
  data: MGNEREGAData;
  timestamp: number;
}

export class MemStorage implements IStorage {
  private cache: Map<string, CacheEntry>;
  private sampleData: any;
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

  constructor() {
    this.cache = new Map();
    this.sampleData = this.loadSampleData();
  }

  private loadSampleData(): any {
    try {
      const dataPath = join(process.cwd(), "data", "mgnrega_sample.json");
      const fileContent = readFileSync(dataPath, "utf-8");
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Failed to load sample data:", error);
      return { districts: [], data: {} };
    }
  }

  async getDistricts(): Promise<District[]> {
    return this.sampleData.districts || [];
  }

  async getDistrictData(districtId: string): Promise<MGNEREGAData | undefined> {
    const cachedData = await this.getCachedDistrictData(districtId);
    if (cachedData) {
      return cachedData;
    }

    const data = this.sampleData.data[districtId];
    if (data) {
      await this.cacheDistrictData(districtId, data);
      return data;
    }

    return undefined;
  }

  async cacheDistrictData(districtId: string, data: MGNEREGAData): Promise<void> {
    this.cache.set(districtId, {
      data,
      timestamp: Date.now(),
    });
  }

  async getCachedDistrictData(districtId: string): Promise<MGNEREGAData | undefined> {
    const entry = this.cache.get(districtId);
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(districtId);
      return undefined;
    }

    return entry.data;
  }
}

export const storage = new MemStorage();
