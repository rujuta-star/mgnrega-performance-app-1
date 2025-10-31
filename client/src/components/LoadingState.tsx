import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div 
      className="flex-1 flex items-center justify-center p-4"
      data-testid="loading-state"
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            Loading data...
          </p>
          <p 
            className="text-base font-medium text-muted-foreground" 
            style={{ fontFamily: 'Noto Sans Devanagari' }}
          >
            डेटा लोड होत आहे...
          </p>
        </div>
      </div>
    </div>
  );
}
