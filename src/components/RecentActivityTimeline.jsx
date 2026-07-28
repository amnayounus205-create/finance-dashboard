import React from "react";
import { PlusCircle, Edit3, Trash2, Target, DollarSign, Clock } from "lucide-react";

const getActivityIcon = (action) => {
  switch (action) {
    case "Added Income":
    case "Added Expense":
      return <DollarSign size={16} className="text-emerald-600" />;
    case "Updated Budget":
      return <Edit3 size={16} className="text-blue-600" />;
    case "Deleted Transaction":
      return <Trash2 size={16} className="text-rose-600" />;
    case "Created Goal":
      return <Target size={16} className="text-purple-600" />;
    default:
      return <Clock size={16} className="text-gray-500" />;
  }
};

const RecentActivityTimeline = ({ activities = [] }) => {
  if (!activities.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-xs">
        No recent activity recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-800">Recent Activity Timeline</h3>
      
      <div className="relative border-l border-gray-200 ml-3 space-y-6 py-2">
        {activities.map((item) => {
          const timeAgo = new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          const dateStr = new Date(item.timestamp).toLocaleDateString();

          return (
            <div key={item.id} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className="absolute -left-3.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 border border-gray-200 shadow-xs transition group-hover:scale-110">
                {getActivityIcon(item.action)}
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <span className="text-[11px] text-gray-400 mt-1 sm:mt-0">
                  {dateStr} at {timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityTimeline;