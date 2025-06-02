
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { calculateAffordability } from '@/utils/financialCalculations';
import { useToast } from '@/hooks/use-toast';

interface CalculatorInputs {
  monthlyIncome: number;
  currentRent: number;
  propertyValue: number;
  rentToEquityPercent: number;
  loanTerm: number;
  interestRate: number;
  targetDownPayment: number;
}

const RentToOwnCalculator = () => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyIncome: 5000,
    currentRent: 2000,
    propertyValue: 350000,
    rentToEquityPercent: 25,
    loanTerm: 30,
    interestRate: 6.5,
    targetDownPayment: 20
  });

  const [results, setResults] = useState<any>(null);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    try {
      const calculationResults = calculateAffordability(inputs);
      setResults(calculationResults);
      
      toast({
        title: "Calculation Complete",
        description: "Your rent-to-own affordability analysis has been updated.",
      });
    } catch (error) {
      toast({
        title: "Calculation Error", 
        description: "Please check your inputs and try again.",
        variant: "destructive"
      });
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleCalculate();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [inputs]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Affordability Calculator</span>
        </CardTitle>
        <CardDescription>
          Enter your financial details to calculate rent-to-own mortgage affordability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Income Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
                placeholder="5000"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Property & Rent Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Property Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="propertyValue">Target Property Value</Label>
              <Input
                id="propertyValue"
                type="number"
                value={inputs.propertyValue}
                onChange={(e) => handleInputChange('propertyValue', Number(e.target.value))}
                placeholder="350000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currentRent">Monthly Rent Payment</Label>
              <Input
                id="currentRent"
                type="number"
                value={inputs.currentRent}
                onChange={(e) => handleInputChange('currentRent', Number(e.target.value))}
                placeholder="2000"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Rent-to-Equity Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Program Parameters</h3>
          <div>
            <Label htmlFor="rentToEquity">Rent-to-Equity Percentage: {inputs.rentToEquityPercent}%</Label>
            <Slider
              id="rentToEquity"
              min={10}
              max={50}
              step={5}
              value={[inputs.rentToEquityPercent]}
              onValueChange={(value) => handleInputChange('rentToEquityPercent', value[0])}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Percentage of rent that converts to equity/down payment
            </p>
          </div>
          
          <div>
            <Label htmlFor="targetDownPayment">Target Down Payment: {inputs.targetDownPayment}%</Label>
            <Slider
              id="targetDownPayment"
              min={5}
              max={25}
              step={1}
              value={[inputs.targetDownPayment]}
              onValueChange={(value) => handleInputChange('targetDownPayment', value[0])}
              className="mt-2"
            />
          </div>
        </div>

        {/* Loan Parameters */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Loan Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={inputs.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                placeholder="30"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                placeholder="6.5"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCalculate} 
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          Calculate Affordability
        </Button>

        {/* Quick Results Preview */}
        {results && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Quick Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Monthly Equity Building:</span>
                <p className="font-semibold text-green-600">${results.monthlyEquityContribution.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Time to Down Payment:</span>
                <p className="font-semibold text-blue-600">{results.timeToDownPayment} months</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentToOwnCalculator;
