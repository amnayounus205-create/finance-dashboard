const EmptyState = ({
  title = "No Data Found",
  message = "There is nothing to display.",
}) => {
  return (
    <div className="rounded-card border border-dashed border-border bg-card p-10 text-center">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;