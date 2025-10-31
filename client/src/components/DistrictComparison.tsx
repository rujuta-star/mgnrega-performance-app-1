import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import type { District, MGNEREGAData } from '@shared/schema';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DistrictComparisonProps {
  currentDistrict: string;
}

export function DistrictComparison({ currentDistrict }: DistrictComparisonProps) {
  const [compareDistrict, setCompareDistrict] = useState<string>('');

  const { data: districts } = useQuery<District[]>({
    queryKey: ['/api/districts'],
  });

  const { data: currentDistrictData } = useQuery<MGNEREGAData>({
    queryKey: ['/api/data', currentDistrict],
    enabled: !!currentDistrict,
  });

  const { data: compareDistrictData } = useQuery<MGNEREGAData>({
    queryKey: ['/api/data', compareDistrict],
    enabled: !!compareDistrict,
  });

  if (!compareDistrict || !compareDistrictData || !currentDistrictData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-section-desktop">District Comparison</CardTitle>
          <CardDescription className="text-base" style={{ fontFamily: 'Noto Sans Devanagari' }}>
            जिल्हा तुलना
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Compare performance with another district
            </p>
            <Select value={compareDistrict} onValueChange={setCompareDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district to compare / तुलना करण्यासाठी जिल्हा निवडा" />
              </SelectTrigger>
              <SelectContent>
                {districts?.filter(d => d.id !== currentDistrict).map((district) => (
                  <SelectItem key={district.id} value={district.id}>
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
        </CardContent>
      </Card>
    );
  }

  const comparisonData = [
    {
      metric: 'People Benefited',
      metricMarathi: 'लाभार्थी',
      [currentDistrictData.district]: currentDistrictData.totalPeopleBenefited,
      [compareDistrictData.district]: compareDistrictData.totalPeopleBenefited,
    },
    {
      metric: 'Person Days',
      metricMarathi: 'व्यक्ती दिन',
      [currentDistrictData.district]: Math.round(currentDistrictData.totalPersonDays / 1000),
      [compareDistrictData.district]: Math.round(compareDistrictData.totalPersonDays / 1000),
    },
    {
      metric: 'Wages Paid (₹ Cr)',
      metricMarathi: 'वेतन (₹ कोटी)',
      [currentDistrictData.district]: Math.round(currentDistrictData.totalWagesPaid / 10000000),
      [compareDistrictData.district]: Math.round(compareDistrictData.totalWagesPaid / 10000000),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-section-desktop">District Comparison</CardTitle>
            <CardDescription className="text-base" style={{ fontFamily: 'Noto Sans Devanagari' }}>
              जिल्हा तुलना
            </CardDescription>
          </div>
          <Select value={compareDistrict} onValueChange={setCompareDistrict}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {districts?.filter(d => d.id !== currentDistrict).map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="metric"
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
              />
              <Legend />
              <Bar dataKey={currentDistrictData.district} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey={compareDistrictData.district} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{currentDistrictData.district}</h3>
                <Badge>Current</Badge>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">People Benefited:</dt>
                  <dd className="font-medium">{currentDistrictData.totalPeopleBenefited.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Person Days:</dt>
                  <dd className="font-medium">{currentDistrictData.totalPersonDays.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Wages Paid:</dt>
                  <dd className="font-medium">₹{(currentDistrictData.totalWagesPaid / 10000000).toFixed(1)}Cr</dd>
                </div>
              </dl>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{compareDistrictData.district}</h3>
                <Badge variant="secondary">Compare</Badge>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">People Benefited:</dt>
                  <dd className="font-medium">{compareDistrictData.totalPeopleBenefited.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Person Days:</dt>
                  <dd className="font-medium">{compareDistrictData.totalPersonDays.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Wages Paid:</dt>
                  <dd className="font-medium">₹{(compareDistrictData.totalWagesPaid / 10000000).toFixed(1)}Cr</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
