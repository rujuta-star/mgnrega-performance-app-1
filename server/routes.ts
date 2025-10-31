import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { districtListSchema, mgneregaDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getDistricts();
      const validatedDistricts = districtListSchema.parse(districts);
      res.json(validatedDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });

  app.get("/api/data/:district", async (req, res) => {
    try {
      const districtId = req.params.district;
      
      if (!districtId) {
        return res.status(400).json({ error: "District ID is required" });
      }

      const data = await storage.getDistrictData(districtId);
      
      if (!data) {
        return res.status(404).json({ error: "District data not found" });
      }

      const validatedData = mgneregaDataSchema.parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching district data:", error);
      res.status(500).json({ error: "Failed to fetch district data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
