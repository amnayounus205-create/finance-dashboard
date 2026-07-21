import Card from "../common/Card";

const SummaryCard = ({
  title,
  value = 0,
  icon,
  color, // e.g., "bg-green-100 text-green-600" or similar soft utility classes
}) => {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-secondary">
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
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;