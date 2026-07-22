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
  const [storedData, setStoredData] = useLocalStorage(
    "finance-data",
    {
      ...initialState,
      userProfile: {
        name: "John Doe",
        email: "john.doe@example.com",
        currency: "USD",
        notifications: true,
      },
      accounts: [
        { id: "1", name: "Cash Wallet", type: "Cash", balance: 500 },
        { id: "2", name: "Main Bank Account", type: "Bank", balance: 2500 },
        { id: "3", name: "Credit Card", type: "Credit", balance: -200 },
      ],
      recurring: [],
      goals: [],
      invoices: [],
    }
  );

  const [state, dispatch] = useReducer(financeReducer, storedData);

  useEffect(() => {
    setStoredData(state);
  }, [state]);

  // Profile Management
  const updateProfile = (profileData) => {
    dispatch({ type: "UPDATE_PROFILE", payload: profileData });
  };

  // Multi-Account Management
  const addAccount = (account) => {
    dispatch({ type: "ADD_ACCOUNT", payload: { ...account, id: Date.now().toString() } });
  };

  const updateAccount = (account) => {
    dispatch({ type: "UPDATE_ACCOUNT", payload: account });
  };

  const deleteAccount = (id) => {
    dispatch({ type: "DELETE_ACCOUNT", payload: id });
  };

  // Income CRUD
  const addIncome = (income) => {
    dispatch({ type: "ADD_INCOME", payload: income });
  };

  const updateIncome = (income) => {
    dispatch({ type: "UPDATE_INCOME", payload: income });
  };

  const deleteIncome = (id) => {
    dispatch({ type: "DELETE_INCOME", payload: id });
  };

  // Expense CRUD
  const addExpense = (expense) => {
    dispatch({ type: "ADD_EXPENSE", payload: expense });
  };

  const updateExpense = (expense) => {
    dispatch({ type: "UPDATE_EXPENSE", payload: expense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  // Recurring Transactions CRUD & Auto-Generator
  const addRecurring = (item) => {
    dispatch({ type: "ADD_RECURRING", payload: item });
  };

  const updateRecurring = (item) => {
    dispatch({ type: "UPDATE_RECURRING", payload: item });
  };

  const deleteRecurring = (id) => {
    dispatch({ type: "DELETE_RECURRING", payload: id });
  };

  useEffect(() => {
    const checkRecurringTransactions = () => {
      const today = new Date().toISOString().split("T")[0];
      
      state.recurring?.forEach((rec) => {
        if (rec.nextRunDate && rec.nextRunDate <= today) {
          const newTx = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            title: rec.title,
            source: rec.title,
            amount: Number(rec.amount),
            category: rec.category,
            accountId: rec.accountId,
            date: rec.nextRunDate,
            notes: `Auto-generated from recurring (${rec.frequency})`,
          };

          if (rec.type === "Income") {
            addIncome(newTx);
          } else {
            addExpense(newTx);
          }

          const nextDate = new Date(rec.nextRunDate);
          if (rec.frequency === "Daily") {
            nextDate.setDate(nextDate.getDate() + 1);
          } else if (rec.frequency === "Weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (rec.frequency === "Monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else if (rec.frequency === "Yearly") {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }

          updateRecurring({
            ...rec,
            lastRunDate: rec.nextRunDate,
            nextRunDate: nextDate.toISOString().split("T")[0],
          });
        }
      });
    };

    if (state.recurring && state.recurring.length > 0) {
      checkRecurringTransactions();
    }
  }, []);

  // Goals CRUD & Contribution
  const addGoal = (goal) => {
    dispatch({ type: "ADD_GOAL", payload: goal });
  };

  const updateGoal = (goal) => {
    dispatch({ type: "UPDATE_GOAL", payload: goal });
  };

  const deleteGoal = (id) => {
    dispatch({ type: "DELETE_GOAL", payload: id });
  };

  const contributeToGoal = (goalId, amount) => {
    dispatch({ type: "CONTRIBUTE_GOAL", payload: { goalId, amount } });
  };

  // Invoices CRUD & Status Toggle
  const addInvoice = (invoice) => {
    dispatch({ type: "ADD_INVOICE", payload: invoice });
  };

  const updateInvoice = (invoice) => {
    dispatch({ type: "UPDATE_INVOICE", payload: invoice });
  };

  const deleteInvoice = (id) => {
    dispatch({ type: "DELETE_INVOICE", payload: id });
  };

  const toggleInvoiceStatus = (id) => {
    dispatch({ type: "TOGGLE_INVOICE_STATUS", payload: id });
  };

  // Budget CRUD
  const addBudget = (budget) => {
    dispatch({ type: "ADD_BUDGET", payload: budget });
  };

  const updateBudget = (budget) => {
    dispatch({ type: "UPDATE_BUDGET", payload: budget });
  };

  const deleteBudget = (id) => {
    dispatch({ type: "DELETE_BUDGET", payload: id });
  };

  // Calculations
  const totalIncome = useMemo(() => calculateTotal(state.incomes), [state.incomes]);
  const totalExpense = useMemo(() => calculateTotal(state.expenses), [state.expenses]);
  const totalBudget = useMemo(() => calculateTotal(state.budgets), [state.budgets]);
  const totalBalance = calculateBalance(totalIncome, totalExpense);
  const remainingBudget = calculateRemainingBudget(totalBudget, totalExpense);
  const monthlySavings = totalBalance;

  const transactions = useMemo(() => {
    const incomeTransactions = (state.incomes || []).map((item) => ({ ...item, type: "Income" }));
    const expenseTransactions = (state.expenses || []).map((item) => ({ ...item, type: "Expense" }));

    return [...incomeTransactions, ...expenseTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [state.incomes, state.expenses]);

  // Dynamic Live Notifications Count Calculation
  const activeNotificationsCount = useMemo(() => {
    let count = 0;
    const today = new Date();

    // 1. Budgets exceeded check
    (state.budgets || []).forEach((budget) => {
      const spent = (state.expenses || [])
        .filter(exp => exp.category?.toLowerCase() === budget.category?.toLowerCase())
        .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      if (spent >= Number(budget.limit)) count++;
    });

    // 2. Upcoming bills / recurring check
    (state.recurring || []).forEach((item) => {
      const checkDate = item.nextRunDate || item.nextDate;
      if (checkDate && item.type === "Expense") {
        const diffDays = Math.ceil((new Date(checkDate) - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3) count++;
      }
    });

    // 3. Low balance check (< 1000)
    (state.accounts || []).forEach((acc) => {
      if (Number(acc.balance || 0) < 1000) count++;
    });

    // 4. Goals achieved check
    (state.goals || []).forEach((goal) => {
      const current = Number(goal.currentAmount || goal.current || 0);
      const target = Number(goal.targetAmount || goal.target || 0);
      if (current >= target && target > 0) count++;
    });

    return count;
  }, [state.budgets, state.expenses, state.recurring, state.accounts, state.goals]);

  return (
    <FinanceContext.Provider
      value={{
        incomes: state.incomes || [],
        expenses: state.expenses || [],
        budgets: state.budgets || [],
        accounts: state.accounts || [],
        recurring: state.recurring || [],
        goals: state.goals || [],
        invoices: state.invoices || [],
        userProfile: state.userProfile || {
          name: "John Doe",
          email: "john.doe@example.com",
          currency: "USD",
          notifications: true,
        },
        transactions,
        activeNotificationsCount,
        updateProfile,
        addAccount,
        updateAccount,
        deleteAccount,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        addGoal,
        updateGoal,
        deleteGoal,
        contributeToGoal,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        toggleInvoiceStatus,
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