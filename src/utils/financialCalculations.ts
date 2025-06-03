interface CalculatorInputs {
  monthlyIncome: number;
  currentRent: number;
  propertyValue: number;
  rentToEquityPercent: number;
  loanTerm: number;
  interestRate: number;
  targetDownPayment: number;
  // Additional inputs for more accurate calculations
  monthlyDebtPayments?: number;
  creditScore?: number;
  propertyTaxRate?: number;
  homeInsuranceAnnual?: number;
  hoaMonthly?: number;
  maintenancePercent?: number;
  propertyAppreciationRate?: number;
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
  // Additional metrics
  grossDebtServiceRatio: number;
  totalDebtServiceRatio: number;
  monthlyPITI: number;
  stressTestRate: number;
  stressTestPayment: number;
  passesStressTest: boolean;
  maxAffordablePrice: number;
  totalMonthlyHousingCost: number;
  effectiveMonthlyRent: number;
  equityBuildupSchedule: EquityScheduleItem[];
  loanToValueRatio: number;
  frontEndRatio: number;
  backEndRatio: number;
}

interface EquityScheduleItem {
  month: number;
  rentEquityContribution: number;
  principalPayment: number;
  propertyAppreciation: number;
  totalEquity: number;
  homeValue: number;
  loanBalance: number;
}

export const calculateAffordability = (inputs: CalculatorInputs): AffordabilityResults => {
  console.log('Starting affordability calculation with inputs:', inputs);

  // Set default values for optional inputs
  const monthlyDebtPayments = inputs.monthlyDebtPayments || 0;
  const creditScore = inputs.creditScore || 720;
  const propertyTaxRate = inputs.propertyTaxRate || 1.2; // Default 1.2% annual
  const homeInsuranceAnnual = inputs.homeInsuranceAnnual || inputs.propertyValue * 0.0035; // 0.35% of home value
  const hoaMonthly = inputs.hoaMonthly || 0;
  const maintenancePercent = inputs.maintenancePercent || 1.5; // 1.5% annual for maintenance
  const propertyAppreciationRate = inputs.propertyAppreciationRate || 3; // 3% annual appreciation

  // Calculate monthly equity contribution from rent
  const monthlyEquityContribution = inputs.currentRent * (inputs.rentToEquityPercent / 100);
  console.log('Monthly equity contribution:', monthlyEquityContribution);

  // Calculate total down payment needed
  const totalDownPaymentNeeded = inputs.propertyValue * (inputs.targetDownPayment / 100);
  console.log('Total down payment needed:', totalDownPaymentNeeded);

  // Calculate time to reach down payment (in months)
  const timeToDownPayment = Math.ceil(totalDownPaymentNeeded / monthlyEquityContribution);
  console.log('Time to down payment (months):', timeToDownPayment);

  // Calculate monthly mortgage payment (Principal & Interest only)
  const loanAmount = inputs.propertyValue - totalDownPaymentNeeded;
  const monthlyInterestRate = inputs.interestRate / 100 / 12;
  const numberOfPayments = inputs.loanTerm * 12;
  
  const monthlyPrincipalAndInterest = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  
  // Calculate property tax and insurance
  const monthlyPropertyTax = (inputs.propertyValue * propertyTaxRate / 100) / 12;
  const monthlyHomeInsurance = homeInsuranceAnnual / 12;
  
  // Calculate PMI if down payment is less than 20%
  let monthlyPMI = 0;
  if (inputs.targetDownPayment < 20) {
    // PMI typically ranges from 0.5% to 1% annually of the loan amount
    monthlyPMI = (loanAmount * 0.0075) / 12; // Using 0.75% as average
  }
  
  // Calculate total PITI (Principal, Interest, Taxes, Insurance)
  const monthlyPITI = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + hoaMonthly;
  console.log('Monthly PITI:', monthlyPITI);

  // Calculate total monthly housing cost including maintenance
  const monthlyMaintenance = (inputs.propertyValue * maintenancePercent / 100) / 12;
  const totalMonthlyHousingCost = monthlyPITI + monthlyMaintenance;

  // Calculate DTI ratios following industry standards
  // Front-end ratio (housing ratio) - typically max 28%
  const frontEndRatio = (monthlyPITI / inputs.monthlyIncome) * 100;
  
  // Back-end ratio (total DTI) - typically max 36-43%
  const backEndRatio = ((monthlyPITI + monthlyDebtPayments) / inputs.monthlyIncome) * 100;
  
  // GDS (Gross Debt Service) ratio - Canadian standard, max 39%
  const grossDebtServiceRatio = frontEndRatio;
  
  // TDS (Total Debt Service) ratio - Canadian standard, max 44%
  const totalDebtServiceRatio = backEndRatio;

  // Calculate stress test (using 2% above contract rate or 5.25%, whichever is higher)
  const stressTestRate = Math.max(inputs.interestRate + 2, 5.25);
  const stressTestMonthlyRate = stressTestRate / 100 / 12;
  const stressTestPayment = loanAmount * 
    (stressTestMonthlyRate * Math.pow(1 + stressTestMonthlyRate, numberOfPayments)) /
    (Math.pow(1 + stressTestMonthlyRate, numberOfPayments) - 1);
  
  const stressTestPITI = stressTestPayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + hoaMonthly;
  const stressTestDTI = ((stressTestPITI + monthlyDebtPayments) / inputs.monthlyIncome) * 100;
  const passesStressTest = stressTestDTI <= 44; // Using 44% as max for stress test

  // Calculate qualification score (0-100) with more sophisticated scoring
  let qualificationScore = 100;
  
  // DTI scoring (40 points max)
  if (backEndRatio <= 28) {
    qualificationScore -= 0; // Excellent
  } else if (backEndRatio <= 36) {
    qualificationScore -= (backEndRatio - 28) * 2.5; // Good
  } else if (backEndRatio <= 43) {
    qualificationScore -= 20 + (backEndRatio - 36) * 2.85; // Acceptable
  } else {
    qualificationScore -= 40 + (backEndRatio - 43) * 2; // Poor
  }
  
  // Credit score impact (20 points max)
  if (creditScore >= 740) {
    qualificationScore -= 0; // Excellent
  } else if (creditScore >= 680) {
    qualificationScore -= (740 - creditScore) * 0.167;
  } else if (creditScore >= 620) {
    qualificationScore -= 10 + (680 - creditScore) * 0.167;
  } else {
    qualificationScore -= 20; // Poor credit
  }
  
  // Down payment impact (20 points max)
  if (inputs.targetDownPayment >= 20) {
    qualificationScore -= 0; // No PMI needed
  } else if (inputs.targetDownPayment >= 10) {
    qualificationScore -= (20 - inputs.targetDownPayment) * 1;
  } else {
    qualificationScore -= 10 + (10 - inputs.targetDownPayment) * 1;
  }
  
  // Time to down payment impact (20 points max)
  if (timeToDownPayment <= 24) {
    qualificationScore -= 0; // Can achieve down payment within 2 years
  } else if (timeToDownPayment <= 36) {
    qualificationScore -= (timeToDownPayment - 24) * 0.83;
  } else if (timeToDownPayment <= 48) {
    qualificationScore -= 10 + (timeToDownPayment - 36) * 0.83;
  } else {
    qualificationScore -= 20; // More than 4 years
  }
  
  qualificationScore = Math.max(0, Math.min(100, qualificationScore));
  console.log('Qualification score:', qualificationScore);

  // Calculate maximum affordable home price based on DTI limits
  const maxMonthlyPayment = inputs.monthlyIncome * 0.28; // Using 28% front-end ratio
  const maxPITI = maxMonthlyPayment;
  // Work backwards from PITI to find max loan amount
  const estimatedNonPIAmount = monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + hoaMonthly;
  const maxPrincipalAndInterest = maxPITI - estimatedNonPIAmount;
  
  const maxLoanAmount = maxPrincipalAndInterest * 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) /
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));
  
  const maxAffordablePrice = maxLoanAmount + totalDownPaymentNeeded;

  // Calculate equity buildup schedule
  const equityBuildupSchedule: EquityScheduleItem[] = [];
  let remainingBalance = loanAmount;
  let cumulativeEquity = totalDownPaymentNeeded;
  let currentHomeValue = inputs.propertyValue;
  
  for (let month = 1; month <= 36; month++) {
    // Calculate principal payment for this month
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPrincipalAndInterest - interestPayment;
    remainingBalance -= principalPayment;
    
    // Calculate property appreciation
    const monthlyAppreciationRate = Math.pow(1 + propertyAppreciationRate / 100, 1/12) - 1;
    currentHomeValue *= (1 + monthlyAppreciationRate);
    const monthlyAppreciation = currentHomeValue - inputs.propertyValue;
    
    // Add rent equity contribution
    const rentEquity = month <= timeToDownPayment ? monthlyEquityContribution : 0;
    
    // Calculate total equity
    cumulativeEquity = totalDownPaymentNeeded + (principalPayment * month) + monthlyAppreciation + (rentEquity * Math.min(month, timeToDownPayment));
    
    equityBuildupSchedule.push({
      month,
      rentEquityContribution: rentEquity,
      principalPayment,
      propertyAppreciation: monthlyAppreciation,
      totalEquity: cumulativeEquity,
      homeValue: currentHomeValue,
      loanBalance: remainingBalance
    });
  }

  // Calculate projected equity in 3 years
  const projectedEquityIn3Years = equityBuildupSchedule[35]?.totalEquity || 0;
  
  // Calculate property appreciation impact over 3 years
  const propertyAppreciationImpact = Math.pow(1 + propertyAppreciationRate / 100, 3) * inputs.propertyValue - inputs.propertyValue;

  // Calculate effective monthly rent (rent minus equity contribution)
  const effectiveMonthlyRent = inputs.currentRent - monthlyEquityContribution;

  // Calculate loan-to-value ratio
  const loanToValueRatio = (loanAmount / inputs.propertyValue) * 100;

  // Overall assessment with more nuanced evaluation
  let overallAffordabilityAssessment = 'Good';
  if (qualificationScore >= 85 && timeToDownPayment <= 24 && passesStressTest) {
    overallAffordabilityAssessment = 'Excellent';
  } else if (qualificationScore >= 70 && timeToDownPayment <= 36 && passesStressTest) {
    overallAffordabilityAssessment = 'Very Good';
  } else if (qualificationScore >= 60 && backEndRatio <= 43) {
    overallAffordabilityAssessment = 'Good';
  } else if (qualificationScore >= 50) {
    overallAffordabilityAssessment = 'Fair';
  } else {
    overallAffordabilityAssessment = 'Needs Improvement';
  }

  const results: AffordabilityResults = {
    monthlyEquityContribution,
    timeToDownPayment,
    qualificationScore,
    debtToIncomeRatio: backEndRatio,
    monthlyMortgagePayment: monthlyPrincipalAndInterest,
    totalDownPaymentNeeded,
    projectedEquityIn3Years,
    propertyAppreciationImpact,
    overallAffordabilityAssessment,
    grossDebtServiceRatio,
    totalDebtServiceRatio,
    monthlyPITI,
    stressTestRate,
    stressTestPayment,
    passesStressTest,
    maxAffordablePrice,
    totalMonthlyHousingCost,
    effectiveMonthlyRent,
    equityBuildupSchedule,
    loanToValueRatio,
    frontEndRatio,
    backEndRatio
  };

  console.log('Calculation results:', results);
  return results;
};

export const calculateRentToOwnScenarios = (inputs: CalculatorInputs) => {
  // Generate multiple scenarios with different rent-to-equity percentages
  const scenarios = [15, 25, 35, 45].map(percentage => {
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

  if (inputs.targetDownPayment < 3) {
    errors.push('Minimum down payment is typically 3% for FHA loans');
  }

  if (inputs.interestRate < 0 || inputs.interestRate > 20) {
    errors.push('Interest rate must be between 0% and 20%');
  }

  if (inputs.loanTerm < 10 || inputs.loanTerm > 30) {
    errors.push('Loan term must be between 10 and 30 years');
  }

  if (inputs.creditScore && (inputs.creditScore < 300 || inputs.creditScore > 850)) {
    errors.push('Credit score must be between 300 and 850');
  }

  return errors;
};
