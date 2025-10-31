import type { ReactNode } from "react";
import { Users, Calendar, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MGNEREGAData } from "@shared/schema";

interface MetricCardsProps {
  data: MGNEREGAData;
}

function formatNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} K`;
  }
  return num.toLocaleString('en-IN');
}

function formatCurrency(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  labelMarathi: string;
  value: string;
  testId: string;
}

function MetricCard({ icon, label, labelMarathi, value, testId }: MetricCardProps) {
  return (
    <Card 
      className="p-6 flex flex-col min-h-[140px] hover-elevate transition-all duration-200"
      style={{ boxShadow: 'var(--shadow-lg)' }}
      data-testid={testId}
    >
      <div className="flex items-start gap-4">
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-primary">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <p className="text-metric-label text-foreground font-medium">
              {label}
            </p>
            <p 
              className="text-[13px] leading-5 text-muted-foreground font-medium" 
              style={{ fontFamily: 'Noto Sans Devanagari' }}
            >
              {labelMarathi}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <p 
          className="text-metric-value-mobile md:text-metric-value-desktop text-foreground font-mono"
          style={{ fontVariantNumeric: 'tabular-nums' }}
          data-testid={`${testId}-value`}
        >
          {value}
        </p>
      </div>
    </Card>
  );
}

export function MetricCards({ data }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <MetricCard
        icon={<Users className="h-6 w-6" />}
        label="Total People Benefited"
        labelMarathi="एकूण लाभार्थी लोक"
        value={formatNumber(data.totalPeopleBenefited)}
        testId="card-people-benefited"
      />
      <MetricCard
        icon={<Calendar className="h-6 w-6" />}
        label="Total Person-Days Generated"
        labelMarathi="एकूण व्यक्ती-दिवस निर्माण"
        value={formatNumber(data.totalPersonDays)}
        testId="card-person-days"
      />
      <MetricCard
        icon={<IndianRupee className="h-6 w-6" />}
        label="Total Wages Paid"
        labelMarathi="एकूण वेतन दिले"
        value={formatCurrency(data.totalWagesPaid)}
        testId="card-wages-paid"
      />
    </div>
  );
}
