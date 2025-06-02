
interface CalculatorInputs {
  monthlyIncome: number;
  currentRent: number;
  propertyValue: number;
  rentToEquityPercent: number;
  loanTerm: number;
  interestRate: number;
  targetDownPayment: number;
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

  // Calculate debt-to-income ratio
  const debtToIncomeRatio = (monthlyMortgagePayment / inputs.monthlyIncome) * 100;
  console.log('Debt-to-income ratio:', debtToIncomeRatio);

  // Calculate qualification score (0-100)
  let qualificationScore = 100;
  
  // Penalize for high DTI
  if (debtToIncomeRatio > 28) {
    qualificationScore -= (debtToIncomeRatio - 28) * 2;
  }
  
  // Penalize for long time to down payment
  if (timeToDownPayment > 36) {
    qualificationScore -= (timeToDownPayment - 36) * 0.5;
  }
  
  // Reward for higher income
  if (inputs.monthlyIncome > 6000) {
    qualificationScore += 10;
  }
  
  qualificationScore = Math.max(0, Math.min(100, qualificationScore));
  console.log('Qualification score:', qualificationScore);

  // Calculate projected equity in 3 years
  const projectedEquityIn3Years = monthlyEquityContribution * 36;
  
  // Estimate property appreciation impact (3% annual appreciation)
  const propertyAppreciationImpact = inputs.propertyValue * 0.03 * 3;

  // Overall assessment
  let overallAffordabilityAssessment = 'Good';
  if (qualificationScore >= 80 && timeToDownPayment <= 24) {
    overallAffordabilityAssessment = 'Excellent';
  } else if (qualificationScore < 60 || timeToDownPayment > 48) {
    overallAffordabilityAssessment = 'Challenging';
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
    overallAffordabilityAssessment
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

  return errors;
};
