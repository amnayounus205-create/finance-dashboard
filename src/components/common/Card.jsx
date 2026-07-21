function Card({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <h2
        className="text-3xl font-bold mt-2"
        style={{ color }}
      >
        ${Number(value).toLocaleString()}
      </h2>
    </div>
  );
}

export default Card;