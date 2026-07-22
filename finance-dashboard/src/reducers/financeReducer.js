export const initialState = {
  incomes: [],
  expenses: [],
  budgets: [],
  accounts: [
    { id: "1", name: "Cash Wallet", type: "Cash", balance: 500 },
    { id: "2", name: "Main Bank Account", type: "Bank", balance: 2500 },
    { id: "3", name: "Credit Card", type: "Credit", balance: -200 },
  ],
  recurring: [],
  goals: [],
  invoices: [],
  userProfile: {
    name: "John Doe",
    email: "john.doe@example.com",
    currency: "USD",
    notifications: true,
  },
};

export const financeReducer = (state, action) => {
  switch (action.type) {
    // ===========================
    // Profile
    // ===========================

    case "UPDATE_PROFILE":
      return {
        ...state,
        userProfile: action.payload,
      };

    // ===========================
    // Accounts
    // ===========================

    case "ADD_ACCOUNT":
      return {
        ...state,
        accounts: [...state.accounts, action.payload],
      };

    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.id ? action.payload : account
        ),
      };

    case "DELETE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.filter(
          (account) => account.id !== action.payload
        ),
      };

    // ===========================
    // Recurring Transactions
    // ===========================

    case "ADD_RECURRING":
      return {
        ...state,
        recurring: [...(state.recurring || []), action.payload],
      };

    case "UPDATE_RECURRING":
      return {
        ...state,
        recurring: (state.recurring || []).map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case "DELETE_RECURRING":
      return {
        ...state,
        recurring: (state.recurring || []).filter((item) => item.id !== action.payload),
      };

    // ===========================
    // Financial Goals
    // ===========================

    case "ADD_GOAL":
      return {
        ...state,
        goals: [...(state.goals || []), action.payload],
      };

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: (state.goals || []).map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: (state.goals || []).filter((goal) => goal.id !== action.payload),
      };

    case "CONTRIBUTE_GOAL": {
      const { goalId, amount } = action.payload;
      return {
        ...state,
        goals: (state.goals || []).map((goal) => {
          if (goal.id === goalId) {
            const newCurrent = Number(goal.currentAmount || 0) + Number(amount);
            return {
              ...goal,
              currentAmount: newCurrent,
              isCompleted: newCurrent >= Number(goal.targetAmount),
            };
          }
          return goal;
        }),
      };
    }

    // ===========================
    // Invoice Management
    // ===========================

    case "ADD_INVOICE":
      return {
        ...state,
        invoices: [...(state.invoices || []), action.payload],
      };

    case "UPDATE_INVOICE":
      return {
        ...state,
        invoices: (state.invoices || []).map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };

    case "DELETE_INVOICE":
      return {
        ...state,
        invoices: (state.invoices || []).filter((inv) => inv.id !== action.payload),
      };

    case "TOGGLE_INVOICE_STATUS":
      return {
        ...state,
        invoices: (state.invoices || []).map((inv) =>
          inv.id === action.payload
            ? { ...inv, status: inv.status === "Paid" ? "Unpaid" : "Paid" }
            : inv
        ),
      };

    // ===========================
    // Income (Auto Balance Update)
    // ===========================

    case "ADD_INCOME": {
      const newIncome = action.payload;
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === newIncome.accountId) {
          return { ...acc, balance: Number(acc.balance) + Number(newIncome.amount) };
        }
        return acc;
      });

      return {
        ...state,
        incomes: [...state.incomes, newIncome],
        accounts: updatedAccounts,
      };
    }

    case "UPDATE_INCOME": {
      const updatedIncome = action.payload;
      const oldIncome = state.incomes.find((inc) => inc.id === updatedIncome.id);

      const updatedAccounts = state.accounts.map((acc) => {
        if (oldIncome && oldIncome.accountId === updatedIncome.accountId && acc.id === updatedIncome.accountId) {
          return {
            ...acc,
            balance: Number(acc.balance) - Number(oldIncome.amount) + Number(updatedIncome.amount),
          };
        }
        if (oldIncome && oldIncome.accountId !== updatedIncome.accountId) {
          if (acc.id === oldIncome.accountId) {
            return { ...acc, balance: Number(acc.balance) - Number(oldIncome.amount) };
          }
          if (acc.id === updatedIncome.accountId) {
            return { ...acc, balance: Number(acc.balance) + Number(updatedIncome.amount) };
          }
        }
        return acc;
      });

      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income.id === updatedIncome.id ? updatedIncome : income
        ),
        accounts: updatedAccounts,
      };
    }

    case "DELETE_INCOME": {
      const incomeToDelete = state.incomes.find((inc) => inc.id === action.payload);
      const updatedAccounts = state.accounts.map((acc) => {
        if (incomeToDelete && acc.id === incomeToDelete.accountId) {
          return { ...acc, balance: Number(acc.balance) - Number(incomeToDelete.amount) };
        }
        return acc;
      });

      return {
        ...state,
        incomes: state.incomes.filter((income) => income.id !== action.payload),
        accounts: updatedAccounts,
      };
    }

    // ===========================
    // Expense (Auto Balance Update)
    // ===========================

    case "ADD_EXPENSE": {
      const newExpense = action.payload;
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === newExpense.accountId) {
          return { ...acc, balance: Number(acc.balance) - Number(newExpense.amount) };
        }
        return acc;
      });

      return {
        ...state,
        expenses: [...state.expenses, newExpense],
        accounts: updatedAccounts,
      };
    }

    case "UPDATE_EXPENSE": {
      const updatedExpense = action.payload;
      const oldExpense = state.expenses.find((exp) => exp.id === updatedExpense.id);

      const updatedAccounts = state.accounts.map((acc) => {
        if (oldExpense && oldExpense.accountId === updatedExpense.accountId && acc.id === updatedExpense.accountId) {
          return {
            ...acc,
            balance: Number(acc.balance) + Number(oldExpense.amount) - Number(updatedExpense.amount),
          };
        }
        if (oldExpense && oldExpense.accountId !== updatedExpense.accountId) {
          if (acc.id === oldExpense.accountId) {
            return { ...acc, balance: Number(acc.balance) + Number(oldExpense.amount) };
          }
          if (acc.id === updatedExpense.accountId) {
            return { ...acc, balance: Number(acc.balance) - Number(updatedExpense.amount) };
          }
        }
        return acc;
      });

      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        ),
        accounts: updatedAccounts,
      };
    }

    case "DELETE_EXPENSE": {
      const expenseToDelete = state.expenses.find((exp) => exp.id === action.payload);
      const updatedAccounts = state.accounts.map((acc) => {
        if (expenseToDelete && acc.id === expenseToDelete.accountId) {
          return { ...acc, balance: Number(acc.balance) + Number(expenseToDelete.amount) };
        }
        return acc;
      });

      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
        accounts: updatedAccounts,
      };
    }

    // ===========================
    // Budget
    // ===========================

    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter(
          (budget) => budget.id !== action.payload
        ),
      };

    // ===========================
    // Load Local Storage
    // ===========================

    case "SET_DATA":
      return action.payload;

    default:
      return state;
  }
};