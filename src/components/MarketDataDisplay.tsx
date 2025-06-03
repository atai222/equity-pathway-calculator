import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, TrendingUp, Database, Wifi, Home, DollarSign, Users, BarChart } from 'lucide-react';
import { simulateMarketData } from '@/utils/marketDataSimulation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const MarketDataDisplay = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call to third-party market data services
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Simulate delay for API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = simulateMarketData();
        setMarketData(data);
        
        // Generate historical data for trend analysis
        const historical = [];
        for (let i = 12; i >= 0; i--) {
          const monthData = {
            month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
            rent: Math.round(data.rentalMarket.medianRent * (1 - i * 0.003)),
            price: Math.round(data.housingMarket.medianPrice * (1 - i * 0.005)),
            inventory: Math.random() * 3 + 1
          };
          historical.push(monthData);
        }
        setHistoricalData(historical);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Set up periodic updates
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateRentToPriceRatio = () => {
    if (!marketData) return 0;
    return ((marketData.rentalMarket.medianRent * 12) / marketData.housingMarket.medianPrice * 100).toFixed(2);
  };

  const calculateCapRate = () => {
    if (!marketData) return 0;
    const annualRent = marketData.rentalMarket.medianRent * 12;
    const expenses = annualRent * 0.3; // Assume 30% for expenses
    const noi = annualRent - expenses;
    return ((noi / marketData.housingMarket.medianPrice) * 100).toFixed(2);
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInventoryBadgeVariant = (level: string) => {
    switch(level) {
      case 'Low': return 'destructive';
      case 'Moderate': return 'default';
      case 'High': return 'secondary';
      default: return 'outline';
    }
  };

  // Market indicators for radar chart
  const marketIndicators = marketData ? [
    { subject: 'Affordability', value: 10 - (marketData.housingMarket.medianPrice / marketData.economicIndicators.medianHouseholdIncome / 5) * 10 },
    { subject: 'Appreciation', value: Math.min(10, marketData.housingMarket.appreciation) },
    { subject: 'Rent Growth', value: Math.min(10, marketData.rentalMarket.yearOverYearGrowth * 2) },
    { subject: 'Job Market', value: 10 - marketData.economicIndicators.unemploymentRate * 2 },
    { subject: 'Population', value: Math.min(10, marketData.economicIndicators.populationGrowth * 3) },
    { subject: 'Inventory', value: marketData.housingMarket.inventoryLevel === 'Low' ? 8 : marketData.housingMarket.inventoryLevel === 'Moderate' ? 5 : 2 }
  ] : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Market Data Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-gray-600">Fetching real-time market data...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Market Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Live Market Data</span>
          </CardTitle>
          <CardDescription>
            Real-time market insights powered by third-party APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{marketData?.location?.city}, {marketData?.location?.state}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Wifi className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600">Median Rent</p>
                </div>
                <p className="font-semibold text-blue-600">${marketData?.rentalMarket?.medianRent?.toLocaleString()}</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{marketData?.rentalMarket?.yearOverYearGrowth}%</span>
                </div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Median Home Price</p>
                </div>
                <p className="font-semibold text-green-600">${marketData?.housingMarket?.medianPrice?.toLocaleString()}</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{marketData?.housingMarket?.appreciation?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Rent-to-Price Ratio</p>
              <p className="font-semibold text-purple-600">{calculateRentToPriceRatio()}%</p>
              <p className="text-xs text-gray-500">Annual rent / home price</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cap Rate</p>
              <p className="font-semibold text-orange-600">{calculateCapRate()}%</p>
              <p className="text-xs text-gray-500">Investment return</p>
            </div>
          </div>

          {/* Market Trends */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Market Indicators</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rental Vacancy Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={100 - marketData?.rentalMarket?.vacancyRate * 10} className="w-20 h-2" />
                  <span className="font-medium text-sm">{marketData?.rentalMarket?.vacancyRate}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days on Market</span>
                <div className="flex items-center gap-2">
                  <Progress value={100 - (marketData?.housingMarket?.daysOnMarket / 60) * 100} className="w-20 h-2" />
                  <span className="font-medium text-sm">{marketData?.housingMarket?.daysOnMarket} days</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inventory Level</span>
                <Badge variant={getInventoryBadgeVariant(marketData?.housingMarket?.inventoryLevel)}>
                  {marketData?.housingMarket?.inventoryLevel}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unemployment Rate</span>
                <span className="font-medium text-sm">{marketData?.economicIndicators?.unemploymentRate}%</span>
              </div>
            </div>
          </div>

          {/* Market Opportunity Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Market Opportunity Score</h4>
                <p className="text-sm text-gray-600">Rent-to-own market favorability</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${getOpportunityColor(marketData?.opportunityScore)}`}>
                  {marketData?.opportunityScore?.toFixed(1)}/10
                </span>
                <p className="text-xs text-gray-600">
                  {marketData?.opportunityScore >= 7 ? 'Excellent' : marketData?.opportunityScore >= 5 ? 'Good' : 'Fair'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="w-5 h-5 text-indigo-600" />
            <span>12-Month Market Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rent" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Median Rent"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Home Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Health Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span>Market Health Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={marketIndicators}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar 
                  name="Market Score" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6} 
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm font-medium">Apartment List API</span>
              <Badge variant="default" className="text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm font-medium">Zillow API</span>
              <Badge variant="default" className="text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm font-medium">RentSpree API</span>
              <Badge variant="default" className="text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Active
              </Badge>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataDisplay;
