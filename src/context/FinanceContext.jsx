import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Load saved data
  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem("incomes")) || [];
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];

    setIncomes(savedIncomes);
    setExpenses(savedExpenses);
    setBudgets(savedBudgets);
  }, []);

  // Save whenever data changes
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Dashboard calculations
  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + Number(item.amount), 0),
    [incomes]
  );

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenses]
  );

  const totalBudget = useMemo(
    () => budgets.reduce((sum, item) => sum + Number(item.amount), 0),
    [budgets]
  );

  const totalBalance = totalIncome - totalExpense;
  const remainingBudget = totalBudget - totalExpense;
  const monthlySavings = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        setIncomes,

        expenses,
        setExpenses,

        budgets,
        setBudgets,

        totalIncome,
        totalExpense,
        totalBudget,
        totalBalance,
        remainingBudget,
        monthlySavings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);