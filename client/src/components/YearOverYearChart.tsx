import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { YearlyData } from '@shared/schema';

interface YearOverYearChartProps {
  historicalData?: YearlyData[];
  currentYear: number;
  currentYearTotal: number;
}

export function YearOverYearChart({ historicalData, currentYear, currentYearTotal }: YearOverYearChartProps) {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  const chartData = [
    ...historicalData.map(year => ({
      year: year.year.toString(),
      'People Benefited': year.totalPeopleBenefited,
      'Person Days': Math.round(year.totalPersonDays / 1000),
      'Wages (₹ Cr)': Math.round(year.totalWagesPaid / 10000000)
    })),
    {
      year: currentYear.toString(),
      'People Benefited': currentYearTotal,
      'Person Days': 0,
      'Wages (₹ Cr)': 0
    }
  ];

  const formatNumber = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-section-desktop">Year-over-Year Performance</CardTitle>
        <CardDescription className="text-base" style={{ fontFamily: 'Noto Sans Devanagari' }}>
          वर्षानुवर्षे कामगिरी तुलना
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
              className="text-xs"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
            <Bar dataKey="People Benefited" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Person Days" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Wages (₹ Cr)" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {historicalData.slice(-2).map((yearData, idx) => {
            const prevYearData = historicalData[historicalData.length - 2 - idx];
            const growth = prevYearData 
              ? ((yearData.totalPeopleBenefited - prevYearData.totalPeopleBenefited) / prevYearData.totalPeopleBenefited * 100)
              : 0;
            
            return (
              <div key={yearData.year} className="p-4 border border-border rounded-lg">
                <div className="text-sm text-muted-foreground">Growth {yearData.year - 1} → {yearData.year}</div>
                <div className={`text-2xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  People Benefited
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
