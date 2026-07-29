import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { financeReducer, initialState } from "../reducers/financeReducer";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  calculateBalance,
  calculateRemainingBudget,
  calculateTotal,
} from "../utils/calculations";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

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
      tags: [
        { id: "1", name: "Food" },
        { id: "2", name: "Office" },
        { id: "3", name: "Family" },
        { id: "4", name: "Business" },
        { id: "5", name: "Travel" },
      ],
      recurring: [],
      recurringBills: [],
      goals: [],
      invoices: [],
    }
  );

  const [state, dispatch] = useReducer(financeReducer, storedData);

  // --- THEME CUSTOMIZATION STATE (Globalized across all pages) ---
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("app_theme", currentTheme);
    const root = document.documentElement;
    
    // Purani saari theme classes remove karein
    root.classList.remove("dark", "theme-blue", "theme-green");
    
    // Active theme class root par lagayein
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else if (currentTheme === "blue") {
      root.classList.add("theme-blue");
    } else if (currentTheme === "green") {
      root.classList.add("theme-green");
    }
  }, [currentTheme]);

  // --- MULTI-CURRENCY SUPPORT STATE ---
  const [currency, setCurrency] = useState(() => {
    return state.userProfile?.currency || localStorage.getItem("app_currency") || "USD";
  });

  // Currency Symbol helper mapping
  const currencySymbol = useMemo(() => {
    switch (currency) {
      case "EUR": return "€";
      case "GBP": return "£";
      case "PKR": return "₨";
      case "INR": return "₹";
      case "USD":
      default: return "$";
    }
  }, [currency]);

  // Update Currency function (saves to state, profile & local storage)
  const handleSetCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("app_currency", newCurrency);
    
    // Update user profile in state as well
    if (state.userProfile) {
      dispatchWithHistory({
        type: "UPDATE_PROFILE",
        payload: { ...state.userProfile, currency: newCurrency }
      });
    }
    logActivity("Currency Changed", `App currency changed to ${newCurrency} (${currencySymbol})`, "settings");
  };

  // Sync currency if userProfile updates externally
  useEffect(() => {
    if (state.userProfile?.currency && state.userProfile.currency !== currency) {
      setCurrency(state.userProfile.currency);
    }
  }, [state.userProfile?.currency]);

  // --- UNDO / REDO HISTORY STATES ---
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // --- OFFLINE SUPPORT & SYNC STATES ---
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerDummySync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Dummy Sync Implementation when internet comes back
  const triggerDummySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setPendingSyncCount(0);
      localStorage.setItem("finance_synced_timestamp", new Date().toISOString());
      logActivity("Sync Complete", "Offline cached data successfully synchronized with server.", "system");
    }, 1500);
  };

  const dispatchWithHistory = (action) => {
    setPast(prev => [...prev, state]);
    setFuture([]);
    dispatch(action);

    // Track pending sync changes if offline
    if (!navigator.onLine) {
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const undo = () => {
    if (past.length === 0) return;
    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture(prev => [state, ...prev]);
    setPast(newPast);
    dispatch({ type: "SET_FULL_STATE", payload: previousState });
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    const newFuture = future.slice(1);

    setPast(prev => [...prev, state]);
    setFuture(newFuture);
    dispatch({ type: "SET_FULL_STATE", payload: nextState });
  };

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  useEffect(() => {
    setStoredData(state);
  }, [state]);

  // Activity / Audit Logs State & Helper using useLocalStorage
  const [activityLogs, setActivityLogs] = useLocalStorage("finance_activity_logs", [
    { 
      id: 1, 
      action: "Login", 
      description: "User logged into the dashboard successfully.", 
      time: new Date().toLocaleString(), 
      type: "login" 
    }
  ]);

  const logActivity = (action, description, type = "general") => {
    const newLog = {
      id: Date.now(),
      action,
      description,
      time: new Date().toLocaleString(),
      type,
    };
    setActivityLogs((prev) => [newLog, ...(prev || [])]);
  };

  // Auth Helpers for Audit Logging
  const loginUser = () => {
    logActivity("Login", "User logged into the dashboard successfully.", "login");
  };

  const logoutUser = () => {
    logActivity("Logout", "User logged out from the dashboard successfully.", "logout");
  };

  // Profile Management
  const updateProfile = (profileData) => {
    dispatchWithHistory({ type: "UPDATE_PROFILE", payload: profileData });
    if (profileData.currency && profileData.currency !== currency) {
      setCurrency(profileData.currency);
      localStorage.setItem("app_currency", profileData.currency);
    }
    logActivity("Updated Profile", "User profile details were updated.", "profile");
  };

  // Multi-Account Management
  const addAccount = (account) => {
    dispatchWithHistory({ type: "ADD_ACCOUNT", payload: { ...account, id: Date.now().toString() } });
    logActivity("Added Account", `Created new account: '${account.name}'.`, "account");
  };

  const updateAccount = (account) => {
    dispatchWithHistory({ type: "UPDATE_ACCOUNT", payload: account });
    logActivity("Updated Account", `Updated account details for '${account.name}'.`, "account");
  };

  const deleteAccount = (id) => {
    dispatchWithHistory({ type: "DELETE_ACCOUNT", payload: id });
    logActivity("Deleted Account", "Removed an account from the dashboard.", "account");
  };

  // Income CRUD
  const addIncome = (income) => {
    dispatchWithHistory({ type: "ADD_INCOME", payload: income });
    logActivity("Added Transaction", `Recorded income of ${currencySymbol}${income.amount} (${income.title || income.source || 'General'}).`, "transaction");
  };

  const updateIncome = (income) => {
    dispatchWithHistory({ type: "UPDATE_INCOME", payload: income });
    logActivity("Updated Transaction", `Updated income record amounting to ${currencySymbol}${income.amount}.`, "transaction");
  };

  const deleteIncome = (id) => {
    dispatchWithHistory({ type: "DELETE_INCOME", payload: id });
    logActivity("Deleted Transaction", "Removed an income transaction record.", "transaction");
  };

  // Expense CRUD
  const addExpense = (expense) => {
    dispatchWithHistory({ type: "ADD_EXPENSE", payload: expense });
    logActivity("Added Transaction", `Recorded expense of ${currencySymbol}${expense.amount} for '${expense.title || expense.category || 'General'}'.`, "transaction");
  };

  const updateExpense = (expense) => {
    dispatchWithHistory({ type: "UPDATE_EXPENSE", payload: expense });
    logActivity("Updated Transaction", `Updated expense record amounting to ${currencySymbol}${expense.amount}.`, "transaction");
  };

  const deleteExpense = (id) => {
    dispatchWithHistory({ type: "DELETE_EXPENSE", payload: id });
    logActivity("Deleted Expense", "Removed an expense transaction record.", "expense");
  };

  // --- UNIFIED TRANSACTION DELETE HELPER ---
  const deleteTransaction = (id, type) => {
    const isIncome = type === "Income" || (state.incomes || []).some(item => item.id === id);
    if (isIncome || type === "Income") {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }
  };

  // Recurring Bills CRUD
  const [recurringBills, setRecurringBills] = useLocalStorage("finance_recurring_bills", []);

  const addRecurringBill = (bill) => {
    setRecurringBills((prev) => [bill, ...(prev || [])]);
    logActivity("Created Recurring Bill", `Added scheduled bill: '${bill.name}'.`, "recurring");
  };

  const updateRecurringBill = (updatedBill) => {
    setRecurringBills((prev) =>
      (prev || []).map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
    logActivity("Updated Recurring Bill", `Updated scheduled bill: '${updatedBill.name}'.`, "recurring");
  };

  const deleteRecurringBill = (id) => {
    setRecurringBills((prev) => (prev || []).filter((b) => b.id !== id));
    logActivity("Deleted Recurring Bill", "Removed a scheduled recurring bill.", "recurring");
  };

  // Recurring Transactions CRUD
  const addRecurring = (item) => {
    dispatchWithHistory({ type: "ADD_RECURRING", payload: item });
    logActivity("Created Recurring", `Added recurring bill/income: '${item.title}'.`, "recurring");
  };

  const updateRecurring = (item) => {
    dispatchWithHistory({ type: "UPDATE_RECURRING", payload: item });
  };

  const deleteRecurring = (id) => {
    dispatchWithHistory({ type: "DELETE_RECURRING", payload: id });
    logActivity("Deleted Recurring", "Removed a recurring transaction setup.", "recurring");
  };

  // Goals CRUD
  const addGoal = (goal) => {
    dispatchWithHistory({ type: "ADD_GOAL", payload: goal });
    logActivity("Created Goal", `Created a new savings goal: '${goal.title || goal.name}'.`, "goal");
  };

  const updateGoal = (goal) => {
    dispatchWithHistory({ type: "UPDATE_GOAL", payload: goal });
    logActivity("Updated Goal", `Updated details for savings goal: '${goal.title || goal.name}'.`, "goal");
  };

  const deleteGoal = (id) => {
    dispatchWithHistory({ type: "DELETE_GOAL", payload: id });
    logActivity("Deleted Goal", "Removed a savings goal.", "goal");
  };

  const contributeToGoal = (goalId, amount) => {
    dispatchWithHistory({ type: "CONTRIBUTE_GOAL", payload: { goalId, amount } });
    logActivity("Goal Contribution", `Added ${currencySymbol}${amount} contribution to a savings goal.`, "goal");
  };

  // Invoices CRUD
  const addInvoice = (invoice) => {
    dispatchWithHistory({ type: "ADD_INVOICE", payload: invoice });
    logActivity("Created Invoice", `Generated invoice for '${invoice.clientName || 'Client'}'.`, "invoice");
  };

  const updateInvoice = (invoice) => {
    dispatchWithHistory({ type: "UPDATE_INVOICE", payload: invoice });
    logActivity("Updated Invoice", "Updated invoice details.", "invoice");
  };

  const deleteInvoice = (id) => {
    dispatchWithHistory({ type: "DELETE_INVOICE", payload: id });
    logActivity("Deleted Invoice", "Removed an invoice record.", "invoice");
  };

  const toggleInvoiceStatus = (id) => {
    dispatchWithHistory({ type: "TOGGLE_INVOICE_STATUS", payload: id });
    logActivity("Invoice Status", "Toggled status of an invoice.", "invoice");
  };

  // Budget CRUD
  const addBudget = (budget) => {
    dispatchWithHistory({ type: "ADD_BUDGET", payload: budget });
    logActivity("Updated Budget", `Set a new budget limit for '${budget.category}'.`, "budget");
  };

  const updateBudget = (budget) => {
    dispatchWithHistory({ type: "UPDATE_BUDGET", payload: budget });
    logActivity("Updated Budget", `Modified budget limit for '${budget.category}'.`, "budget");
  };

  const deleteBudget = (id) => {
    dispatchWithHistory({ type: "DELETE_BUDGET", payload: id });
    logActivity("Deleted Budget", "Removed a budget category limit.", "budget");
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

  const activeNotificationsCount = useMemo(() => {
    let count = 0;

    (state.budgets || []).forEach((budget) => {
      const spent = (state.expenses || [])
        .filter(exp => exp.category?.toLowerCase() === budget.category?.toLowerCase())
        .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      if (spent >= Number(budget.limit)) count++;
    });

    return count;
  }, [state.budgets, state.expenses]);

  return (
    <FinanceContext.Provider
      value={{
        incomes: state.incomes || [],
        expenses: state.expenses || [],
        budgets: state.budgets || [],
        accounts: state.accounts || [],
        tags: state.tags || [],
        recurring: state.recurring || [],
        recurringBills: recurringBills || [],
        goals: state.goals || [],
        invoices: state.invoices || [],
        activityLogs,
        userProfile: state.userProfile || {},
        currentTheme,
        setCurrentTheme,
        currency,
        setCurrency: handleSetCurrency,
        currencySymbol,
        transactions,
        activeNotificationsCount,
        isOnline,
        isSyncing,
        pendingSyncCount,
        undo,
        redo,
        canUndo,
        canRedo,
        logActivity,
        loginUser,
        logoutUser,
        updateProfile,
        addAccount,
        updateAccount,
        deleteAccount,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        addRecurringBill,
        updateRecurringBill,
        deleteRecurringBill,
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
        deleteTransaction,
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
      {/* Floating Offline/Sync Status Indicator */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
        {isSyncing ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
            <RefreshCw size={16} className="animate-spin" /> Syncing with server...
          </div>
        ) : !isOnline ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-full shadow-lg animate-bounce">
            <WifiOff size={16} /> Offline (Local Changes: {pendingSyncCount})
          </div>
        ) : pendingSyncCount > 0 && !isSyncing ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg">
            <Wifi size={16} /> Online ({pendingSyncCount} changes synced)
          </div>
        ) : null}
      </div>

      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);