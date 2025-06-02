
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Home, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FinancialMetrics = () => {
  const [metrics, setMetrics] = useState({
    qualificationScore: 75,
    debtToIncomeRatio: 28,
    equityProjection: [
      { month: 1, equity: 500, cumulative: 500 },
      { month: 6, equity: 500, cumulative: 3000 },
      { month: 12, equity: 500, cumulative: 6000 },
      { month: 18, equity: 500, cumulative: 9000 },
      { month: 24, equity: 500, cumulative: 12000 },
      { month: 30, equity: 500, cumulative: 15000 },
      { month: 36, equity: 500, cumulative: 18000 }
    ],
    monthlyBreakdown: [
      { category: 'Rent Payment', amount: 2000, equity: 500 },
      { category: 'Traditional Savings', amount: 0, equity: 0 },
      { category: 'Property Appreciation', amount: 0, equity: 583 }
    ]
  });

  const getQualificationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualificationStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { status: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      {/* Qualification Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Qualification Assessment</span>
          </CardTitle>
          <CardDescription>
            Your likelihood of qualifying for a rent-to-own mortgage program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Qualification Score</span>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getQualificationColor(metrics.qualificationScore)}`}>
                  {metrics.qualificationScore}%
                </span>
                <Badge className={getQualificationStatus(metrics.qualificationScore).color}>
                  {getQualificationStatus(metrics.qualificationScore).status}
                </Badge>
              </div>
            </div>
            <Progress value={metrics.qualificationScore} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Debt-to-Income</p>
                <p className="font-semibold text-blue-600">{metrics.debtToIncomeRatio}%</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Home className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Housing Ratio</p>
                <p className="font-semibold text-green-600">32%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equity Building Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Equity Building Timeline</span>
          </CardTitle>
          <CardDescription>
            Projected equity accumulation through rent-to-own program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.equityProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Cumulative Equity ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [`$${value.toLocaleString()}`, 'Cumulative Equity']}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Year 1</p>
              <p className="font-semibold text-green-600">$6,000</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Year 2</p>
              <p className="font-semibold text-green-600">$12,000</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Year 3</p>
              <p className="font-semibold text-green-600">$18,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span>Monthly Contribution Breakdown</span>
          </CardTitle>
          <CardDescription>
            How your monthly payments build toward homeownership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={120} />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`, 
                    name === 'amount' ? 'Payment' : 'Equity Built'
                  ]}
                />
                <Bar dataKey="amount" fill="#3b82f6" name="amount" />
                <Bar dataKey="equity" fill="#10b981" name="equity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetrics;
