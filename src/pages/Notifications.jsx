import { useMemo } from "react";
import { AlertTriangle, Bell, CalendarClock, TrendingDown, Target, CheckCircle2, ShieldAlert } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Notifications = () => {
  const { 
    budgets = [], 
    expenses = [], 
    incomes = [], 
    recurring = [], 
    accounts = [], 
    goals = [], 
    userProfile 
  } = useFinance();

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  // Generate Notifications Dynamically
  const notifications = useMemo(() => {
    const list = [];
    const today = new Date();

    // 1. Budget Exceeded Alerts
    budgets.forEach((budget) => {
      const spent = expenses
        .filter(exp => exp.category?.toLowerCase() === budget.category?.toLowerCase())
        .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      
      if (spent > Number(budget.limit)) {
        list.push({
          id: `budget-${budget.id || budget.category}`,
          type: "danger",
          category: "Budget Exceeded",
          title: `Budget Limit Exceeded for ${budget.category}`,
          message: `You've spent ${currencySymbol}${spent.toLocaleString()} against your limit of ${currencySymbol}${Number(budget.limit).toLocaleString()}.`,
          icon: AlertTriangle,
          date: "Just now"
        });
      } else if (spent >= Number(budget.limit) * 0.85) {
        list.push({
          id: `budget-warn-${budget.id || budget.category}`,
          type: "warning",
          category: "Budget Warning",
          title: `Approaching Budget Limit (${budget.category})`,
          message: `You have utilized over 85% of your ${budget.category} budget.`,
          icon: ShieldAlert,
          date: "Recently"
        });
      }
    });

    // 2. Upcoming Bills / Recurring Transactions Alerts
    recurring.forEach((item) => {
      if (item.nextDate) {
        const itemDate = new Date(item.nextDate);
        const diffTime = itemDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 3 && item.type === "Expense") {
          list.push({
            id: `bill-${item.id}`,
            type: "warning",
            category: "Upcoming Bills",
            title: `Upcoming Bill: ${item.name || item.category}`,
            message: `A recurring payment of ${currencySymbol}${Number(item.amount).toLocaleString()} is due in ${diffDays === 0 ? "today" : `${diffDays} day(s)`}.`,
            icon: CalendarClock,
            date: item.nextDate
          });
        }
      }
    });

    // 3. Low Balance Warning Alerts
    accounts.forEach((acc) => {
      const balance = Number(acc.balance || 0);
      if (balance < 1000) { // Threshold can be adjusted or set via profile if needed
        list.push({
          id: `acc-${acc.id}`,
          type: "danger",
          category: "Low Balance Warning",
          title: `Low Balance in ${acc.name}`,
          message: `Your account balance has dropped to ${currencySymbol}${balance.toLocaleString()}.`,
          icon: TrendingDown,
          date: "Current"
        });
      }
    });

    // 4. Goal Achieved Alerts
    goals.forEach((goal) => {
      const current = Number(goal.currentAmount || 0);
      const target = Number(goal.targetAmount || 0);
      if (current >= target && target > 0) {
        list.push({
          id: `goal-${goal.id}`,
          type: "success",
          category: "Goal Achieved",
          title: `Congratulations! Goal Completed 🎉`,
          message: `You have successfully reached your target for "${goal.name}" (${currencySymbol}${target.toLocaleString()}).`,
          icon: Target,
          date: "Completed"
        });
      }
    });

    return list;
  }, [budgets, expenses, recurring, accounts, goals, currencySymbol]);

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Notifications & Alerts</h1>
          <p className="text-gray-500 mt-1">
            Real-time financial alerts regarding your budgets, bills, low balances, and achievements.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Bell size={18} className="text-blue-600" />
          <span className="text-xs font-bold text-secondary">{notifications.length} Active Alerts</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-secondary">All Clear!</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              You have no active alerts. Your budgets are under control, accounts are healthy, and bills are paid.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const IconComponent = notif.icon;
            
            // Dynamic styling based on notification category/type
            let bgStyle = "bg-white border-gray-100";
            let iconStyle = "bg-blue-50 text-blue-600";
            let badgeStyle = "bg-blue-50 text-blue-700";

            if (notif.category === "Budget Exceeded" || notif.category === "Low Balance Warning") {
              bgStyle = "bg-red-50/30 border-red-100";
              iconStyle = "bg-red-50 text-red-600";
              badgeStyle = "bg-red-50 text-red-700";
            } else if (notif.category === "Budget Warning" || notif.category === "Upcoming Bills") {
              bgStyle = "bg-amber-50/30 border-amber-100";
              iconStyle = "bg-amber-50 text-amber-600";
              badgeStyle = "bg-amber-50 text-amber-700";
            } else if (notif.category === "Goal Achieved") {
              bgStyle = "bg-emerald-50/30 border-emerald-100";
              iconStyle = "bg-emerald-50 text-emerald-600";
              badgeStyle = "bg-emerald-50 text-emerald-700";
            }

            return (
              <div 
                key={notif.id} 
                className={`p-5 rounded-2xl shadow-sm border flex items-start gap-4 transition-all hover:shadow-md ${bgStyle}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${badgeStyle}`}>
                      {notif.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{notif.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-secondary mt-1.5">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;