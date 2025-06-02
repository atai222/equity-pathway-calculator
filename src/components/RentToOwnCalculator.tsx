import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { calculateAffordability, validateInputs } from '@/utils/financialCalculations';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Calculator, DollarSign, Home, TrendingUp, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CalculatorInputs {
  monthlyIncome: number;
  currentRent: number;
  propertyValue: number;
  rentToEquityPercent: number;
  loanTerm: number;
  interestRate: number;
  targetDownPayment: number;
  monthlyDebtPayments: number;
  creditScore: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  hoaMonthly: number;
  maintenancePercent: number;
  propertyAppreciationRate: number;
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
    targetDownPayment: 20,
    monthlyDebtPayments: 500,
    creditScore: 720,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1225, // 0.35% of $350k
    hoaMonthly: 0,
    maintenancePercent: 1.5,
    propertyAppreciationRate: 3
  });

  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    const validationErrors = validateInputs(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before calculating.",
        variant: "destructive"
      });
      return;
    }

    try {
      setErrors([]);
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
      if (errors.length === 0) {
        handleCalculate();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [inputs]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAssessmentBadge = (assessment: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'Excellent': 'default',
      'Very Good': 'default',
      'Good': 'secondary',
      'Fair': 'outline',
      'Needs Improvement': 'destructive'
    };
    return <Badge variant={variants[assessment] || 'secondary'}>{assessment}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Advanced Affordability Calculator</span>
        </CardTitle>
        <CardDescription>
          Comprehensive rent-to-own mortgage analysis with DTI ratios and stress testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="property">Property Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Income Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Income & Debt
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={inputs.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyDebtPayments">Monthly Debt Payments</Label>
                  <Input
                    id="monthlyDebtPayments"
                    type="number"
                    value={inputs.monthlyDebtPayments}
                    onChange={(e) => handleInputChange('monthlyDebtPayments', Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Credit cards, auto loans, student loans, etc.</p>
                </div>
              </div>
            </div>

            {/* Property Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyValue">Target Property Value</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={inputs.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', Number(e.target.value))}
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
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            {/* Credit Score */}
            <div>
              <Label htmlFor="creditScore">Credit Score: {inputs.creditScore}</Label>
              <Slider
                id="creditScore"
                min={300}
                max={850}
                step={10}
                value={[inputs.creditScore]}
                onValueChange={(value) => handleInputChange('creditScore', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor (300)</span>
                <span>Fair (580)</span>
                <span>Good (670)</span>
                <span>Excellent (740+)</span>
              </div>
            </div>

            {/* Rent-to-Equity Settings */}
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
                ${((inputs.currentRent * inputs.rentToEquityPercent) / 100).toFixed(0)}/month goes toward down payment
              </p>
            </div>
            
            {/* Down Payment */}
            <div>
              <Label htmlFor="targetDownPayment">Target Down Payment: {inputs.targetDownPayment}%</Label>
              <Slider
                id="targetDownPayment"
                min={3}
                max={30}
                step={1}
                value={[inputs.targetDownPayment]}
                onValueChange={(value) => handleInputChange('targetDownPayment', value[0])}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                ${((inputs.propertyValue * inputs.targetDownPayment) / 100).toLocaleString()} total needed
              </p>
            </div>

            {/* Loan Terms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanTerm">Loan Term (years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
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
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="property" className="space-y-4">
            {/* Property Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyTaxRate">Property Tax Rate (%/year)</Label>
                <Input
                  id="propertyTaxRate"
                  type="number"
                  step="0.1"
                  value={inputs.propertyTaxRate}
                  onChange={(e) => handleInputChange('propertyTaxRate', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="homeInsuranceAnnual">Annual Home Insurance</Label>
                <Input
                  id="homeInsuranceAnnual"
                  type="number"
                  value={inputs.homeInsuranceAnnual}
                  onChange={(e) => handleInputChange('homeInsuranceAnnual', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoaMonthly">Monthly HOA Fees</Label>
                <Input
                  id="hoaMonthly"
                  type="number"
                  value={inputs.hoaMonthly}
                  onChange={(e) => handleInputChange('hoaMonthly', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maintenancePercent">Maintenance (%/year)</Label>
                <Input
                  id="maintenancePercent"
                  type="number"
                  step="0.1"
                  value={inputs.maintenancePercent}
                  onChange={(e) => handleInputChange('maintenancePercent', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Property Appreciation */}
            <div>
              <Label htmlFor="propertyAppreciationRate">Expected Property Appreciation (%/year)</Label>
              <Input
                id="propertyAppreciationRate"
                type="number"
                step="0.5"
                value={inputs.propertyAppreciationRate}
                onChange={(e) => handleInputChange('propertyAppreciationRate', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCalculate} 
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          Calculate Affordability
        </Button>

        {/* Results Display */}
        {results && (
          <div className="mt-8 space-y-6">
            {/* Quick Summary */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Affordability Assessment</h4>
                  <p className="text-gray-600">Based on comprehensive financial analysis</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(results.qualificationScore)}`}>
                    {results.qualificationScore}%
                  </div>
                  {getAssessmentBadge(results.overallAffordabilityAssessment)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600">Monthly Equity</p>
                  <p className="font-semibold text-green-600">
                    ${results.monthlyEquityContribution.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600">Time to Down Payment</p>
                  <p className="font-semibold text-blue-600">
                    {results.timeToDownPayment} months
                  </p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600">Total DTI Ratio</p>
                  <p className={`font-semibold ${results.backEndRatio > 43 ? 'text-red-600' : 'text-green-600'}`}>
                    {results.backEndRatio.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600">Stress Test</p>
                  <p className={`font-semibold ${results.passesStressTest ? 'text-green-600' : 'text-red-600'}`}>
                    {results.passesStressTest ? 'Pass' : 'Fail'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* DTI Ratios Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Debt-to-Income Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Front-End (Housing) Ratio</span>
                    <span className={`font-semibold ${results.frontEndRatio > 28 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {results.frontEndRatio.toFixed(1)}% / 28%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Back-End (Total) Ratio</span>
                    <span className={`font-semibold ${results.backEndRatio > 36 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {results.backEndRatio.toFixed(1)}% / 36-43%
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Lower ratios improve approval chances and may qualify you for better rates
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Costs Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="w-4 h-4 text-green-600" />
                    Monthly Housing Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Principal & Interest</span>
                    <span className="font-semibold">${results.monthlyMortgagePayment.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total PITI</span>
                    <span className="font-semibold">${results.monthlyPITI.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total w/ Maintenance</span>
                    <span className="font-semibold text-blue-600">
                      ${results.totalMonthlyHousingCost.toFixed(0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Effective Rent Cost</span>
                      <span className="font-semibold text-green-600">
                        ${results.effectiveMonthlyRent.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      After ${results.monthlyEquityContribution} equity contribution
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stress Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    Stress Test Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stress Test Rate</span>
                    <span className="font-semibold">{results.stressTestRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stress Test Payment</span>
                    <span className="font-semibold">${results.stressTestPayment.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Result</span>
                    <Badge variant={results.passesStressTest ? "default" : "destructive"}>
                      {results.passesStressTest ? "Pass" : "Fail"}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Tests ability to afford payments at {results.stressTestRate.toFixed(2)}% rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Affordability Limits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    Affordability Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Home Price</span>
                    <span className="font-semibold">${inputs.propertyValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Affordable Price</span>
                    <span className={`font-semibold ${results.maxAffordablePrice < inputs.propertyValue ? 'text-red-600' : 'text-green-600'}`}>
                      ${results.maxAffordablePrice.toFixed(0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Loan-to-Value Ratio</span>
                    <span className="font-semibold">{results.loanToValueRatio.toFixed(1)}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Based on 28% front-end DTI ratio limit
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3-Year Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3-Year Equity Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Down Payment Savings</p>
                    <p className="font-semibold text-blue-600">
                      ${(results.monthlyEquityContribution * Math.min(36, results.timeToDownPayment)).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Property Appreciation</p>
                    <p className="font-semibold text-green-600">
                      ${results.propertyAppreciationImpact.toFixed(0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Total Equity in 3 Years</p>
                    <p className="font-semibold text-purple-600">
                      ${results.projectedEquityIn3Years.toFixed(0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentToOwnCalculator;
