
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

interface AffordabilityResults {
  monthlyEquityContribution: number;
  timeToDownPayment: number;
  qualificationScore: number;
  debtToIncomeRatio: number;
  monthlyMortgagePayment: number;
  totalDownPaymentNeeded: number;
  projectedEquityIn3Years: number;
  propertyAppreciationImpact: number;
  overallAffordabilityAssessment: string;
  frontEndRatio: number;
  backEndRatio: number;
  monthlyPITI: number;
  totalMonthlyHousingCost: number;
  effectiveMonthlyRent: number;
  stressTestRate: number;
  stressTestPayment: number;
  passesStressTest: boolean;
  maxAffordablePrice: number;
  loanToValueRatio: number;
}

export const calculateAffordability = (inputs: CalculatorInputs): AffordabilityResults => {
  console.log('Starting affordability calculation with inputs:', inputs);

  // Calculate monthly equity contribution from rent
  const monthlyEquityContribution = inputs.currentRent * (inputs.rentToEquityPercent / 100);
  console.log('Monthly equity contribution:', monthlyEquityContribution);

  // Calculate total down payment needed
  const totalDownPaymentNeeded = inputs.propertyValue * (inputs.targetDownPayment / 100);
  console.log('Total down payment needed:', totalDownPaymentNeeded);

  // Calculate time to reach down payment (in months)
  const timeToDownPayment = Math.ceil(totalDownPaymentNeeded / monthlyEquityContribution);
  console.log('Time to down payment (months):', timeToDownPayment);

  // Calculate monthly mortgage payment
  const loanAmount = inputs.propertyValue - totalDownPaymentNeeded;
  const monthlyInterestRate = inputs.interestRate / 100 / 12;
  const numberOfPayments = inputs.loanTerm * 12;
  
  const monthlyMortgagePayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  
  console.log('Monthly mortgage payment:', monthlyMortgagePayment);

  // Calculate additional monthly costs
  const monthlyPropertyTax = (inputs.propertyValue * inputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = inputs.homeInsuranceAnnual / 12;
  const monthlyMaintenance = (inputs.propertyValue * inputs.maintenancePercent / 100) / 12;
  
  // Calculate PITI (Principal, Interest, Taxes, Insurance)
  const monthlyPITI = monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance;
  
  // Calculate total monthly housing cost including maintenance and HOA
  const totalMonthlyHousingCost = monthlyPITI + inputs.hoaMonthly + monthlyMaintenance;

  // Calculate effective monthly rent (after equity contribution)
  const effectiveMonthlyRent = inputs.currentRent - monthlyEquityContribution;

  // Calculate DTI ratios
  const frontEndRatio = (monthlyPITI / inputs.monthlyIncome) * 100;
  const backEndRatio = ((monthlyPITI + inputs.monthlyDebtPayments) / inputs.monthlyIncome) * 100;
  
  // For backward compatibility, use frontEndRatio as debtToIncomeRatio
  const debtToIncomeRatio = frontEndRatio;
  
  console.log('Front-end DTI ratio:', frontEndRatio);
  console.log('Back-end DTI ratio:', backEndRatio);

  // Calculate stress test (typically 2% higher than current rate)
  const stressTestRate = inputs.interestRate + 2;
  const stressTestMonthlyRate = stressTestRate / 100 / 12;
  const stressTestPayment = loanAmount * 
    (stressTestMonthlyRate * Math.pow(1 + stressTestMonthlyRate, numberOfPayments)) /
    (Math.pow(1 + stressTestMonthlyRate, numberOfPayments) - 1);
  
  const stressTestPITI = stressTestPayment + monthlyPropertyTax + monthlyInsurance;
  const stressTestFrontEndRatio = (stressTestPITI / inputs.monthlyIncome) * 100;
  const passesStressTest = stressTestFrontEndRatio <= 32; // 32% stress test limit

  // Calculate maximum affordable price (based on 28% front-end DTI)
  const maxMonthlyHousing = inputs.monthlyIncome * 0.28;
  const maxMortgagePayment = maxMonthlyHousing - monthlyPropertyTax - monthlyInsurance;
  const maxLoanAmount = maxMortgagePayment / 
    ((monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1));
  const maxAffordablePrice = maxLoanAmount + totalDownPaymentNeeded;

  // Calculate loan-to-value ratio
  const loanToValueRatio = (loanAmount / inputs.propertyValue) * 100;

  // Calculate qualification score (0-100)
  let qualificationScore = 100;
  
  // Penalize for high front-end DTI
  if (frontEndRatio > 28) {
    qualificationScore -= (frontEndRatio - 28) * 2;
  }
  
  // Penalize for high back-end DTI
  if (backEndRatio > 36) {
    qualificationScore -= (backEndRatio - 36) * 1.5;
  }
  
  // Penalize for long time to down payment
  if (timeToDownPayment > 36) {
    qualificationScore -= (timeToDownPayment - 36) * 0.5;
  }
  
  // Reward for higher credit score
  if (inputs.creditScore > 740) {
    qualificationScore += 10;
  } else if (inputs.creditScore < 620) {
    qualificationScore -= 15;
  }
  
  // Penalize if fails stress test
  if (!passesStressTest) {
    qualificationScore -= 10;
  }
  
  qualificationScore = Math.max(0, Math.min(100, qualificationScore));
  console.log('Qualification score:', qualificationScore);

  // Calculate projected equity in 3 years
  const projectedEquityIn3Years = monthlyEquityContribution * 36;
  
  // Estimate property appreciation impact
  const propertyAppreciationImpact = inputs.propertyValue * (inputs.propertyAppreciationRate / 100) * 3;

  // Overall assessment
  let overallAffordabilityAssessment = 'Good';
  if (qualificationScore >= 85 && timeToDownPayment <= 24 && passesStressTest) {
    overallAffordabilityAssessment = 'Excellent';
  } else if (qualificationScore >= 70 && timeToDownPayment <= 36) {
    overallAffordabilityAssessment = 'Very Good';
  } else if (qualificationScore < 50 || timeToDownPayment > 60 || !passesStressTest) {
    overallAffordabilityAssessment = 'Challenging';
  } else if (qualificationScore < 60 || timeToDownPayment > 48) {
    overallAffordabilityAssessment = 'Needs Improvement';
  }

  const results: AffordabilityResults = {
    monthlyEquityContribution,
    timeToDownPayment,
    qualificationScore,
    debtToIncomeRatio,
    monthlyMortgagePayment,
    totalDownPaymentNeeded,
    projectedEquityIn3Years,
    propertyAppreciationImpact,
    overallAffordabilityAssessment,
    frontEndRatio,
    backEndRatio,
    monthlyPITI,
    totalMonthlyHousingCost,
    effectiveMonthlyRent,
    stressTestRate,
    stressTestPayment,
    passesStressTest,
    maxAffordablePrice,
    loanToValueRatio
  };

  console.log('Calculation results:', results);
  return results;
};

export const calculateRentToOwnScenarios = (inputs: CalculatorInputs) => {
  // Generate multiple scenarios with different rent-to-equity percentages
  const scenarios = [15, 25, 35].map(percentage => {
    const scenarioInputs = { ...inputs, rentToEquityPercent: percentage };
    return {
      percentage,
      results: calculateAffordability(scenarioInputs)
    };
  });

  return scenarios;
};

export const validateInputs = (inputs: CalculatorInputs): string[] => {
  const errors: string[] = [];

  if (inputs.monthlyIncome <= 0) {
    errors.push('Monthly income must be greater than 0');
  }

  if (inputs.currentRent <= 0) {
    errors.push('Current rent must be greater than 0');
  }

  if (inputs.propertyValue <= 0) {
    errors.push('Property value must be greater than 0');
  }

  if (inputs.rentToEquityPercent < 0 || inputs.rentToEquityPercent > 50) {
    errors.push('Rent-to-equity percentage must be between 0 and 50');
  }

  if (inputs.currentRent > inputs.monthlyIncome * 0.5) {
    errors.push('Rent should not exceed 50% of monthly income');
  }

  if (inputs.monthlyDebtPayments < 0) {
    errors.push('Monthly debt payments cannot be negative');
  }

  if (inputs.creditScore < 300 || inputs.creditScore > 850) {
    errors.push('Credit score must be between 300 and 850');
  }

  return errors;
};
