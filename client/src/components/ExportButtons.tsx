import { FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { exportToCSV, exportToPDF } from '@/lib/export';
import type { MGNEREGAData } from '@shared/schema';

interface ExportButtonsProps {
  data: MGNEREGAData;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-section-desktop">Export Data</CardTitle>
        <CardDescription className="text-base" style={{ fontFamily: 'Noto Sans Devanagari' }}>
          डेटा डाउनलोड करा
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => exportToPDF(data)}
            className="flex items-center gap-2"
            variant="default"
          >
            <Printer className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button 
            onClick={() => exportToCSV(data)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export as CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Download district performance reports for offline analysis or sharing with stakeholders.
        </p>
        <p 
          className="text-sm text-muted-foreground mt-2" 
          style={{ fontFamily: 'Noto Sans Devanagari' }}
        >
          ऑफलाइन विश्लेषणासाठी किंवा इतरांसोबत शेअर करण्यासाठी जिल्हा कामगिरी अहवाल डाउनलोड करा.
        </p>
      </CardContent>
    </Card>
  );
}
