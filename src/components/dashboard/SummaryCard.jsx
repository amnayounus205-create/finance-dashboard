import Card from "../common/Card";

const SummaryCard = ({
  title,
  value = 0,
  icon,
  color,
}) => {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-secondary">
            ${Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <p className="mt-2 text-xs text-green-600 font-medium">
            Updated in real time
          </p>
        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;