import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyData } from "@shared/schema";

interface MonthlyChartProps {
  data: MonthlyData[];
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
}

function formatNumber(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = data.map(item => ({
    month: item.month,
    monthMarathi: item.monthMarathi,
    peopleBenefited: item.peopleBenefited,
    personDays: item.personDays,
    wagesPaid: item.wagesPaid,
  }));

  return (
    <Card 
      className="p-4 md:p-8"
      style={{ boxShadow: 'var(--shadow-lg)' }}
      data-testid="chart-monthly-performance"
    >
      <div className="mb-6">
        <h2 className="text-section-mobile md:text-section-desktop text-foreground">
          Monthly Performance (Last 6 Months)
        </h2>
        <p 
          className="text-base md:text-lg font-semibold text-muted-foreground mt-1" 
          style={{ fontFamily: 'Noto Sans Devanagari' }}
        >
          मासिक कामगिरी (गेली 6 महिने)
        </p>
      </div>

      <div className="w-full h-[320px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
                marginBottom: '8px',
              }}
              formatter={(value: number, name: string) => {
                const displayName = 
                  name === 'peopleBenefited' ? 'People Benefited' :
                  name === 'personDays' ? 'Person-Days' :
                  name === 'wagesPaid' ? 'Wages Paid' : name;
                
                const formattedValue = name === 'wagesPaid' 
                  ? formatCurrency(value)
                  : formatNumber(value);
                
                return [formattedValue, displayName];
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              formatter={(value: string) => {
                const displayName = 
                  value === 'peopleBenefited' ? 'People Benefited' :
                  value === 'personDays' ? 'Person-Days' :
                  value === 'wagesPaid' ? 'Wages Paid' : value;
                return displayName;
              }}
            />
            <Bar
              dataKey="peopleBenefited"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="personDays"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="wagesPaid"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
