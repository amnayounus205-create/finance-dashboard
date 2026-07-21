import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { financeReducer, initialState } from "../reducers/financeReducer";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  calculateBalance,
  calculateRemainingBudget,
  calculateTotal,
} from "../utils/calculations";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // Local Storage
  const [storedData, setStoredData] = useLocalStorage(
    "finance-data",
    initialState
  );

  // Reducer
  const [state, dispatch] = useReducer(financeReducer, storedData);

  // Save to Local Storage whenever state changes
  useEffect(() => {
    setStoredData(state);
  }, [state]);

  // ===========================
  // Income CRUD
  // ===========================

  const addIncome = (income) => {
    dispatch({
      type: "ADD_INCOME",
      payload: income,
    });
  };

  const updateIncome = (income) => {
    dispatch({
      type: "UPDATE_INCOME",
      payload: income,
    });
  };

  const deleteIncome = (id) => {
    dispatch({
      type: "DELETE_INCOME",
      payload: id,
    });
  };

  // ===========================
  // Expense CRUD
  // ===========================

  const addExpense = (expense) => {
    dispatch({
      type: "ADD_EXPENSE",
      payload: expense,
    });
  };

  const updateExpense = (expense) => {
    dispatch({
      type: "UPDATE_EXPENSE",
      payload: expense,
    });
  };

  const deleteExpense = (id) => {
    dispatch({
      type: "DELETE_EXPENSE",
      payload: id,
    });
  };

  // ===========================
  // Budget CRUD
  // ===========================

  const addBudget = (budget) => {
    dispatch({
      type: "ADD_BUDGET",
      payload: budget,
    });
  };

  const updateBudget = (budget) => {
    dispatch({
      type: "UPDATE_BUDGET",
      payload: budget,
    });
  };

  const deleteBudget = (id) => {
    dispatch({
      type: "DELETE_BUDGET",
      payload: id,
    });
  };

  // ===========================
  // Dashboard Calculations
  // ===========================

  const totalIncome = useMemo(
    () => calculateTotal(state.incomes),
    [state.incomes]
  );

  const totalExpense = useMemo(
    () => calculateTotal(state.expenses),
    [state.expenses]
  );

  const totalBudget = useMemo(
    () => calculateTotal(state.budgets),
    [state.budgets]
  );

  const totalBalance = calculateBalance(totalIncome, totalExpense);

  const remainingBudget = calculateRemainingBudget(
    totalBudget,
    totalExpense
  );

  const monthlySavings = totalBalance;

  // ===========================
  // Transactions
  // ===========================

  const transactions = useMemo(() => {
    const incomeTransactions = state.incomes.map((item) => ({
      ...item,
      type: "Income",
    }));

    const expenseTransactions = state.expenses.map((item) => ({
      ...item,
      type: "Expense",
    }));

    return [...incomeTransactions, ...expenseTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [state.incomes, state.expenses]);

  return (
    <FinanceContext.Provider
      value={{
        incomes: state.incomes,
        expenses: state.expenses,
        budgets: state.budgets,

        transactions,

        addIncome,
        updateIncome,
        deleteIncome,

        addExpense,
        updateExpense,
        deleteExpense,

        addBudget,
        updateBudget,
        deleteBudget,

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