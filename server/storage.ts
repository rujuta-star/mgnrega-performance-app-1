import type { District, MGNEREGAData } from "@shared/schema";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
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

interface FileCacheEntry {
  data: MGNEREGAData;
  timestamp: number;
  source: 'api' | 'sample' | 'cache';
}

export class EnhancedStorage implements IStorage {
  private memoryCache: Map<string, CacheEntry>;
  private sampleData: any;
  private readonly CACHE_DURATION = 3600000;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  private readonly PERSISTENT_CACHE_DIR = join(process.cwd(), "data", "cache");
  private readonly API_ENABLED = !!process.env.DATA_GOV_IN_API_KEY;

  constructor() {
    this.memoryCache = new Map();
    this.sampleData = this.loadSampleData();
    this.ensureCacheDirectoryExists();
    
    if (this.API_ENABLED) {
      console.log('[Storage] API integration enabled. Will attempt to fetch from data.gov.in API.');
    } else {
      console.log('[Storage] API integration disabled. Using sample/cached data. Set DATA_GOV_IN_API_KEY to enable API.');
    }
  }

  private ensureCacheDirectoryExists(): void {
    if (!existsSync(this.PERSISTENT_CACHE_DIR)) {
      mkdirSync(this.PERSISTENT_CACHE_DIR, { recursive: true });
    }
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

  private async fetchFromAPIWithRetry(districtId: string, retries = 0): Promise<MGNEREGAData | null> {
    if (!this.API_ENABLED) {
      return null;
    }

    try {
      console.log(`[API] Attempting to fetch data for district: ${districtId} (attempt ${retries + 1}/${this.MAX_RETRIES})`);
      
      const apiKey = process.env.DATA_GOV_IN_API_KEY;
      const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID;
      
      if (!apiKey) {
        console.log('[API] No API key found. Set DATA_GOV_IN_API_KEY environment variable to enable API integration.');
        return null;
      }
      
      if (!resourceId) {
        console.log('[API] No resource ID found. Set DATA_GOV_IN_RESOURCE_ID environment variable with the actual resource ID from data.gov.in');
        return null;
      }

      const district = this.sampleData.districts.find((d: any) => d.id === districtId);
      const districtName = district?.name || districtId;

      const response = await fetch(
        `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&filters[district_name]=${districtName}`,
        {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.status === 429) {
        console.log('[API] Rate limit exceeded. Using cached data.');
        return null;
      }

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const apiData = await response.json();
      return this.transformAPIDataToSchema(apiData, districtId);
      
    } catch (error: any) {
      console.error(`[API] Fetch attempt ${retries + 1} failed:`, error.message);
      
      if (retries < this.MAX_RETRIES - 1) {
        await this.sleep(this.RETRY_DELAY * Math.pow(2, retries));
        return this.fetchFromAPIWithRetry(districtId, retries + 1);
      }
      
      console.log('[API] All retry attempts exhausted. Falling back to cached/sample data.');
      return null;
    }
  }

  private transformAPIDataToSchema(apiData: any, districtId: string): MGNEREGAData | null {
    try {
      const records = apiData.records || (Array.isArray(apiData) ? apiData : [apiData]);
      
      if (!records || records.length === 0) {
        console.log('[API] No records found in API response');
        return null;
      }

      const districtRecord = records[0];
      const district = this.sampleData.districts.find((d: any) => d.id === districtId);
      
      return {
        district: districtRecord.district_name || district?.name || districtId,
        districtMarathi: districtRecord.district_name_marathi || district?.nameMarathi || '',
        totalPeopleBenefited: parseInt(districtRecord.total_people || districtRecord.total_beneficiaries || '0', 10),
        totalPersonDays: parseInt(districtRecord.total_person_days || districtRecord.person_days || '0', 10),
        totalWagesPaid: parseInt(districtRecord.total_wages || districtRecord.wages_paid || '0', 10),
        lastUpdated: districtRecord.last_updated || districtRecord.updated_on || new Date().toISOString().split('T')[0],
        monthlyData: this.transformMonthlyData(districtRecord.monthly_data || []),
        historicalData: this.transformHistoricalData(districtRecord.historical_data || [])
      };
    } catch (error) {
      console.error('[API] Failed to transform API data:', error);
      return null;
    }
  }

  private transformMonthlyData(monthlyData: any[]): any[] {
    if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
      return [];
    }

    return monthlyData.map(month => ({
      month: month.month || month.month_name || '',
      monthMarathi: month.month_marathi || '',
      peopleBenefited: parseInt(month.people || month.beneficiaries || '0', 10),
      personDays: parseInt(month.person_days || month.days || '0', 10),
      wagesPaid: parseInt(month.wages || month.wages_paid || '0', 10),
      year: month.year || new Date().getFullYear()
    }));
  }

  private transformHistoricalData(historicalData: any[]): any[] {
    if (!Array.isArray(historicalData) || historicalData.length === 0) {
      return [];
    }

    return historicalData.map(year => ({
      year: parseInt(year.year || '0', 10),
      totalPeopleBenefited: parseInt(year.total_people || '0', 10),
      totalPersonDays: parseInt(year.total_person_days || '0', 10),
      totalWagesPaid: parseInt(year.total_wages || '0', 10),
      monthlyData: this.transformMonthlyData(year.monthly_data || [])
    }));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private loadFromPersistentCache(districtId: string): MGNEREGAData | null {
    try {
      const cachePath = join(this.PERSISTENT_CACHE_DIR, `${districtId}.json`);
      
      if (!existsSync(cachePath)) {
        return null;
      }

      const fileContent = readFileSync(cachePath, "utf-8");
      const cacheEntry: FileCacheEntry = JSON.parse(fileContent);

      const now = Date.now();
      if (now - cacheEntry.timestamp > this.CACHE_DURATION) {
        console.log(`[Cache] Persistent cache expired for district: ${districtId}`);
        return null;
      }

      console.log(`[Cache] Loaded from persistent cache: ${districtId} (source: ${cacheEntry.source})`);
      return cacheEntry.data;
      
    } catch (error) {
      console.error(`[Cache] Failed to read persistent cache for ${districtId}:`, error);
      return null;
    }
  }

  private saveToPersistentCache(districtId: string, data: MGNEREGAData, source: 'api' | 'sample' | 'cache'): void {
    try {
      const cachePath = join(this.PERSISTENT_CACHE_DIR, `${districtId}.json`);
      const cacheEntry: FileCacheEntry = {
        data,
        timestamp: Date.now(),
        source
      };
      
      writeFileSync(cachePath, JSON.stringify(cacheEntry, null, 2), "utf-8");
      console.log(`[Cache] Saved to persistent cache: ${districtId} (source: ${source})`);
      
    } catch (error) {
      console.error(`[Cache] Failed to write persistent cache for ${districtId}:`, error);
    }
  }

  async getDistricts(): Promise<District[]> {
    return this.sampleData.districts || [];
  }

  async getDistrictData(districtId: string): Promise<MGNEREGAData | undefined> {
    const memoryCached = await this.getCachedDistrictData(districtId);
    if (memoryCached) {
      return memoryCached;
    }

    const persistentCached = this.loadFromPersistentCache(districtId);
    if (persistentCached) {
      await this.cacheDistrictData(districtId, persistentCached);
      return persistentCached;
    }

    const apiData = await this.fetchFromAPIWithRetry(districtId);
    if (apiData) {
      console.log(`[API] Successfully fetched data from API for district: ${districtId}`);
      await this.cacheDistrictData(districtId, apiData);
      this.saveToPersistentCache(districtId, apiData, 'api');
      return apiData;
    }

    const sampleDataForDistrict = this.sampleData.data[districtId];
    if (sampleDataForDistrict) {
      console.log(`[Sample] Using sample data for district: ${districtId}`);
      await this.cacheDistrictData(districtId, sampleDataForDistrict);
      this.saveToPersistentCache(districtId, sampleDataForDistrict, 'sample');
      return sampleDataForDistrict;
    }

    console.error(`[Error] No data available for district: ${districtId}`);
    return undefined;
  }

  async cacheDistrictData(districtId: string, data: MGNEREGAData): Promise<void> {
    this.memoryCache.set(districtId, {
      data,
      timestamp: Date.now(),
    });
  }

  async getCachedDistrictData(districtId: string): Promise<MGNEREGAData | undefined> {
    const entry = this.memoryCache.get(districtId);
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.memoryCache.delete(districtId);
      return undefined;
    }

    return entry.data;
  }
}

export const storage = new EnhancedStorage();
