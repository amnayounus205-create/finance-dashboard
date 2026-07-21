export const initialState = {
  incomes: [],
  expenses: [],
  budgets: [],
};

export const financeReducer = (state, action) => {
  switch (action.type) {
    // ===========================
    // Income
    // ===========================

    case "ADD_INCOME":
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
      };

    case "UPDATE_INCOME":
      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income.id === action.payload.id ? action.payload : income
        ),
      };

    case "DELETE_INCOME":
      return {
        ...state,
        incomes: state.incomes.filter(
          (income) => income.id !== action.payload
        ),
      };

    // ===========================
    // Expense
    // ===========================

    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };

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