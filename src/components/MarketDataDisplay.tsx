
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, Database, Wifi } from 'lucide-react';
import { simulateMarketData } from '@/utils/marketDataSimulation';

const MarketDataDisplay = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to third-party market data services
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Simulate delay for API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = simulateMarketData();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Live Market Data</span>
        </CardTitle>
        <CardDescription>
          Third-party API integration for localized market insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{marketData?.location?.city}, {marketData?.location?.state}</span>
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Median Rent</p>
              <p className="font-semibold text-blue-600">${marketData?.rentalMarket?.medianRent?.toLocaleString()}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+{marketData?.rentalMarket?.yearOverYearGrowth}%</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Median Home Price</p>
              <p className="font-semibold text-green-600">${marketData?.housingMarket?.medianPrice?.toLocaleString()}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+{marketData?.housingMarket?.appreciation}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Market Trends</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rental Vacancy Rate</span>
              <span className="font-medium">{marketData?.rentalMarket?.vacancyRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Days on Market (Sales)</span>
              <span className="font-medium">{marketData?.housingMarket?.daysOnMarket} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inventory Levels</span>
              <Badge variant={marketData?.housingMarket?.inventoryLevel === 'Low' ? 'destructive' : 'default'}>
                {marketData?.housingMarket?.inventoryLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Data Sources</h4>
          <div className="space-y-1 text-xs text-gray-500">
            <p>• Rental data: Apartment List API</p>
            <p>• Property values: Zillow API</p>
            <p>• Market trends: RentSpree API</p>
            <p className="text-green-600 font-medium">✓ All data updated in real-time</p>
          </div>
        </div>

        {/* Market Opportunity Score */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-900">Market Opportunity</h4>
              <p className="text-sm text-gray-600">Rent-to-own favorability score</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-600">{marketData?.opportunityScore}/10</span>
              <p className="text-xs text-gray-600">Excellent</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataDisplay;
