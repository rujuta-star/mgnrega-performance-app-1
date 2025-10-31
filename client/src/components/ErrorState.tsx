import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div 
      className="flex-1 flex items-center justify-center p-4"
      data-testid="error-state"
    >
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle 
              className="h-16 w-16 text-destructive" 
              aria-hidden="true"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-section-mobile md:text-section-desktop text-foreground">
            Unable to Load Data
          </h2>
          <p 
            className="text-base md:text-lg font-semibold text-muted-foreground" 
            style={{ fontFamily: 'Noto Sans Devanagari' }}
          >
            डेटा लोड करू शकत नाही
          </p>
        </div>

        <p className="text-base text-muted-foreground">
          We couldn't fetch the MGNREGA data for this district. This could be due to network issues or data unavailability.
        </p>

        <Button 
          onClick={onRetry}
          size="lg"
          className="min-h-12 px-6"
          data-testid="button-retry"
        >
          Try Again / पुन्हा प्रयत्न करा
        </Button>
      </Card>
    </div>
  );
}
