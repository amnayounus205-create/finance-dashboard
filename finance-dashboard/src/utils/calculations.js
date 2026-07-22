export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + Number(item.amount), 0);
};

export const calculateBalance = (income, expense) => {
  return income - expense;
};

export const calculateRemainingBudget = (budget, expense) => {
  return budget - expense;
};

export const calculateBudgetPercentage = (expense, budget) => {
  if (budget === 0) return 0;

  return Math.min((expense / budget) * 100, 100);
};