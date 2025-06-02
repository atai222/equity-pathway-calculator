
import React from 'react';
import { Calculator, TrendingUp, Home, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RentToOwnCalculator from '@/components/RentToOwnCalculator';
import FinancialMetrics from '@/components/FinancialMetrics';
import MarketDataDisplay from '@/components/MarketDataDisplay';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-green-700 bg-clip-text text-transparent">
                Rent-to-Own Mortgage Calculator
              </h1>
              <p className="text-gray-600 text-sm">Empowering homeownership through innovative financing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Calculate Your Path to Homeownership
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced rent-to-own calculator helps you understand how rental payments can contribute 
            to building equity and qualifying for a mortgage, making homeownership more accessible.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calculator className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Advanced algorithms incorporating income, rent, property appreciation, and equity building
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Real-time market data integration for accurate rental rates and property valuations
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Equity Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Visualize how rental payments convert to equity and down payment contributions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Calculator and Results */}
        <div className="grid lg:grid-cols-2 gap-8">
          <RentToOwnCalculator />
          <div className="space-y-6">
            <FinancialMetrics />
            <MarketDataDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
