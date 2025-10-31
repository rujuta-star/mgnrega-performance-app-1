import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { 
  Header, 
  MetricCards, 
  MonthlyChart, 
  LoadingState, 
  ErrorState, 
  Footer,
  YearOverYearChart,
  DistrictComparison,
  ExportButtons
} from "@/components";
import type { MGNEREGAData, District } from "@shared/schema";

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [autoDetected, setAutoDetected] = useState(false);

  const { data: districtData, isLoading, error, refetch } = useQuery<MGNEREGAData>({
    queryKey: ["/api/data", selectedDistrict],
    enabled: !!selectedDistrict,
  });

  if (!selectedDistrict) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          selectedDistrict={selectedDistrict}
          onDistrictChange={(district: string, wasAutoDetected: boolean) => {
            setSelectedDistrict(district);
            setAutoDetected(wasAutoDetected);
          }}
          autoDetected={autoDetected}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md space-y-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-8">
                <BarChart3 className="h-16 w-16 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-section-desktop font-semibold text-foreground">
              Select a District
            </h2>
            <p className="text-section-desktop font-semibold text-foreground" style={{ fontFamily: 'Noto Sans Devanagari' }}>
              जिल्हा निवडा
            </p>
            <p className="text-base text-muted-foreground">
              Choose a district from the dropdown above to view MGNREGA performance data
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          selectedDistrict={selectedDistrict}
          onDistrictChange={(district: string, wasAutoDetected: boolean) => {
            setSelectedDistrict(district);
            setAutoDetected(wasAutoDetected);
          }}
          autoDetected={autoDetected}
        />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  if (error || !districtData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          selectedDistrict={selectedDistrict}
          onDistrictChange={(district: string, wasAutoDetected: boolean) => {
            setSelectedDistrict(district);
            setAutoDetected(wasAutoDetected);
          }}
          autoDetected={autoDetected}
        />
        <ErrorState onRetry={() => refetch()} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        selectedDistrict={selectedDistrict}
        onDistrictChange={(district: string, wasAutoDetected: boolean) => {
          setSelectedDistrict(district);
          setAutoDetected(wasAutoDetected);
        }}
        autoDetected={autoDetected}
      />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-8 md:space-y-12">
          <MetricCards data={districtData} />
          <MonthlyChart data={districtData.monthlyData} />
          <YearOverYearChart 
            historicalData={districtData.historicalData} 
            currentYear={2025} 
            currentYearTotal={districtData.totalPeopleBenefited} 
          />
          <DistrictComparison currentDistrict={selectedDistrict} />
          <ExportButtons data={districtData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
