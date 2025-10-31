import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { District } from "@shared/schema";

interface HeaderProps {
  selectedDistrict: string;
  onDistrictChange: (district: string, wasAutoDetected: boolean) => void;
  autoDetected: boolean;
}

export function Header({ selectedDistrict, onDistrictChange, autoDetected }: HeaderProps) {
  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/districts"],
  });

  useEffect(() => {
    if (!selectedDistrict && districts && districts.length > 0 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let closestDistrict = districts[0];
          let minDistance = Number.MAX_VALUE;
          
          districts.forEach((district: any) => {
            if (district.lat && district.lng) {
              const distance = Math.sqrt(
                Math.pow(district.lat - userLat, 2) + 
                Math.pow(district.lng - userLng, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                closestDistrict = district;
              }
            }
          });
          
          if (closestDistrict) {
            onDistrictChange(closestDistrict.id, true);
          }
        },
        (error) => {
          console.log('Geolocation not available:', error.message);
        }
      );
    }
  }, [selectedDistrict, districts, onDistrictChange]);

  return (
    <header 
      className="sticky top-0 z-50 bg-background border-b border-border"
      style={{ boxShadow: 'var(--shadow-md)' }}
      data-testid="header-main"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-header-mobile md:text-header-desktop font-bold text-foreground truncate">
              MGNREGA District Dashboard
            </h1>
            <p 
              className="text-sm md:text-base font-semibold text-muted-foreground truncate" 
              style={{ fontFamily: 'Noto Sans Devanagari' }}
            >
              महाराष्ट्र जिल्हा डॅशबोर्ड
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-[280px]">
            <Select value={selectedDistrict} onValueChange={(value) => onDistrictChange(value, false)}>
              <SelectTrigger 
                className="h-12 gap-2 bg-background"
                data-testid="select-district"
              >
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder="Select District / जिल्हा निवडा" />
                {autoDetected && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Auto-detected
                  </Badge>
                )}
              </SelectTrigger>
              <SelectContent>
                {districts?.map((district) => (
                  <SelectItem 
                    key={district.id} 
                    value={district.id}
                    data-testid={`district-option-${district.id}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{district.name}</span>
                      <span 
                        className="text-xs text-muted-foreground" 
                        style={{ fontFamily: 'Noto Sans Devanagari' }}
                      >
                        {district.nameMarathi}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
