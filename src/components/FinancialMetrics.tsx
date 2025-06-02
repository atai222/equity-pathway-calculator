import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Home, Calendar, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

const FinancialMetrics = () => {
  const [metrics, setMetrics] = useState({
    qualificationScore: 75,
    debtToIncomeRatio: 28,
    frontEndRatio: 22,
    backEndRatio: 28,
    grossDebtService: 22,
    totalDebtService: 28,
    stressTestResult: true,
    equityProjection: [
      { month: 0, equity: 0, cumulative: 0, appreciation: 0, principal: 0 },
      { month: 6, equity: 500, cumulative: 3000, appreciation: 875, principal: 1200 },
      { month: 12, equity: 500, cumulative: 6000, appreciation: 1775, principal: 2450 },
      { month: 18, equity: 500, cumulative: 9000, appreciation: 2700, principal: 3750 },
      { month: 24, equity: 500, cumulative: 12000, appreciation: 3650, principal: 5100 },
      { month: 30, equity: 500, cumulative: 15000, appreciation: 4625, principal: 6500 },
      { month: 36, equity: 500, cumulative: 18000, appreciation: 5625, principal: 7950 }
    ],
    monthlyBreakdown: [
      { category: 'Principal & Interest', amount: 1850, color: '#3b82f6' },
      { category: 'Property Tax', amount: 350, color: '#10b981' },
      { category: 'Insurance & PMI', amount: 180, color: '#f59e0b' },
      { category: 'HOA Fees', amount: 0, color: '#8b5cf6' },
      { category: 'Maintenance', amount: 437, color: '#ef4444' }
    ],
    dtiBreakdown: [
      { name: 'Housing (PITI)', value: 22, color: '#3b82f6' },
      { name: 'Other Debt', value: 6, color: '#10b981' },
      { name: 'Available Income', value: 72, color: '#e5e7eb' }
    ],
    rentVsBuyComparison: [
      { month: 'Current', rent: 2000, own: 2817, equity: 500 },
      { month: 'Year 1', rent: 2060, own: 2817, equity: 500 },
      { month: 'Year 2', rent: 2122, own: 2817, equity: 500 },
      { month: 'Year 3', rent: 2185, own: 2817, equity: 500 },
      { month: 'Year 5', rent: 2318, own: 2817, equity: 0 }
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

  const getDTIStatus = (ratio: number) => {
    if (ratio <= 28) return { status: 'Excellent', color: 'text-green-600' };
    if (ratio <= 36) return { status: 'Good', color: 'text-blue-600' };
    if (ratio <= 43) return { status: 'Acceptable', color: 'text-yellow-600' };
    return { status: 'High Risk', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Qualification Score with DTI Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Mortgage Qualification Assessment</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis based on DTI ratios and lending standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Qualification Score</span>
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
            
            {/* DTI Ratio Details */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Front-End Ratio (Housing)
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Ratio</span>
                  <span className={`font-semibold ${getDTIStatus(metrics.frontEndRatio).color}`}>
                    {metrics.frontEndRatio}%
                  </span>
                </div>
                <Progress value={(metrics.frontEndRatio / 28) * 100} className="h-2" />
                <p className="text-xs text-gray-500">Target: ≤28% | Max: 31%</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Back-End Ratio (Total Debt)
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Ratio</span>
                  <span className={`font-semibold ${getDTIStatus(metrics.backEndRatio).color}`}>
                    {metrics.backEndRatio}%
                  </span>
                </div>
                <Progress value={(metrics.backEndRatio / 43) * 100} className="h-2" />
                <p className="text-xs text-gray-500">Target: ≤36% | Max: 43%</p>
              </div>
            </div>
            
            {/* Stress Test Result */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stress Test @ 8.5%</span>
                <Badge variant={metrics.stressTestResult ? "default" : "destructive"}>
                  {metrics.stressTestResult ? "PASS" : "FAIL"}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Tests affordability at qualifying rate (current rate + 2% or 5.25%, whichever is higher)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DTI Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            <span>Income Allocation Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={metrics.dtiBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.dtiBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {metrics.dtiBreakdown.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded`} style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Equity Building Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Equity Building Analysis</span>
          </CardTitle>
          <CardDescription>
            Comprehensive view of equity accumulation through multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.equityProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Equity ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Rent Equity"
                />
                <Area 
                  type="monotone" 
                  dataKey="principal" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Principal Paydown"
                />
                <Area 
                  type="monotone" 
                  dataKey="appreciation" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Appreciation"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Rent Equity (3yr)</p>
              <p className="font-semibold text-blue-600">$18,000</p>
              <p className="text-xs text-gray-500">$500/month</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Principal Paydown</p>
              <p className="font-semibold text-green-600">$7,950</p>
              <p className="text-xs text-gray-500">Increasing monthly</p>
            </div>
            <div className="p-3 bg-amber-50 rounded">
              <p className="text-sm text-gray-600">Appreciation</p>
              <p className="font-semibold text-amber-600">$5,625</p>
              <p className="text-xs text-gray-500">3% annually</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Payment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span>Monthly Housing Cost Analysis</span>
          </CardTitle>
          <CardDescription>
            Complete breakdown of monthly homeownership expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={120} />
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6">
                  {metrics.monthlyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Total Monthly Cost</span>
            <span className="text-xl font-bold text-indigo-600">
              ${metrics.monthlyBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Rent vs Buy Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-teal-600" />
            <span>Rent vs. Own Cost Comparison</span>
          </CardTitle>
          <CardDescription>
            Monthly cost comparison with equity consideration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.rentVsBuyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="rent" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Rent Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="own" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Own Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Equity Building"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-teal-50 rounded">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Key Insight:</span> While owning costs more monthly, 
              you're building ${metrics.rentVsBuyComparison[0].equity}/month in equity during the rent-to-own period.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetrics;
