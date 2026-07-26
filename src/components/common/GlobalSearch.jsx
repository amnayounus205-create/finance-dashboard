import { useState, useMemo } from "react";
import { Search, X, DollarSign, Wallet, Target, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";

const GlobalSearch = ({ onClose }) => {
  const { incomes, expenses, budgets, goals, accounts } = useFinance();
  const [query, setQuery] = useState("");

  // Sabhi categories mein ek sath search karna
  const results = useMemo(() => {
    if (!query.trim()) return { incomes: [], expenses: [], budgets: [], goals: [], accounts: [] };

    const q = query.toLowerCase();

    return {
      incomes: incomes.filter(
        (item) =>
          item.source?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q)
      ),
      expenses: expenses.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q)
      ),
      budgets: budgets.filter((item) => item.category?.toLowerCase().includes(q)),
      goals: goals.filter((item) => item.title?.toLowerCase().includes(q)),
      accounts: accounts.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) || item.type?.toLowerCase().includes(q)
      ),
    };
  }, [query, incomes, expenses, budgets, goals, accounts]);

  const totalResultsCount =
    results.incomes.length +
    results.expenses.length +
    results.budgets.length +
    results.goals.length +
    results.accounts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/50 pt-20 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-gray-100 px-4 py-3">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search across Income, Expenses, Budgets, Goals, Accounts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 mr-2">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <p className="text-center text-xs text-gray-400 py-8">
              Type something to search across your entire finance dashboard...
            </p>
          ) : totalResultsCount === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              No results found for "<span className="font-semibold text-gray-800">{query}</span>"
            </p>
          ) : (
            <>
              {/* Incomes */}
              {results.incomes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-1.5">
                    <ArrowDownRight size={14} /> Income ({results.incomes.length})
                  </h3>
                  <div className="space-y-1">
                    {results.incomes.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{item.source}</p>
                          <p className="text-xs text-gray-400">{item.category} • {item.date}</p>
                        </div>
                        <span className="font-semibold text-emerald-600">+${Number(item.amount).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expenses */}
              {results.expenses.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-1.5">
                    <ArrowUpRight size={14} /> Expenses ({results.expenses.length})
                  </h3>
                  <div className="space-y-1">
                    {results.expenses.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.category} • {item.date}</p>
                        </div>
                        <span className="font-semibold text-rose-600">-${Number(item.amount).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accounts */}
              {results.accounts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <Wallet size={14} /> Accounts ({results.accounts.length})
                  </h3>
                  <div className="space-y-1">
                    {results.accounts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.type}</p>
                        </div>
                        <span className="font-semibold text-gray-700">${Number(item.balance).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budgets */}
              {results.budgets.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-2 flex items-center gap-1.5">
                    <PieChart size={14} /> Budgets ({results.budgets.length})
                  </h3>
                  <div className="space-y-1">
                    {results.budgets.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
                        <p className="font-medium text-gray-800">{item.category}</p>
                        <span className="text-xs text-gray-600">Limit: ${item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {results.goals.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1.5">
                    <Target size={14} /> Goals ({results.goals.length})
                  </h3>
                  <div className="space-y-1">
                    {results.goals.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <span className="text-xs text-gray-600">${item.currentAmount} / ${item.targetAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;