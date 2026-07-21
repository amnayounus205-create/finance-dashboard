const IncomeTable = ({ incomes }) => {
  if (incomes.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        No income added yet.
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="p-3 text-left">Source</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Date</th>
        </tr>
      </thead>

      <tbody>
        {incomes.map((income) => (
          <tr key={income.id} className="border-b">
            <td className="p-3">{income.source}</td>
            <td className="p-3">{income.category}</td>
            <td className="p-3">${income.amount}</td>
            <td className="p-3">{income.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IncomeTable;