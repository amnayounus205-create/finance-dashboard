const Input = ({
  label,
  type = "text",
  placeholder = "",
  register,
  name,
  error,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-secondary">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        {...(register && name ? register(name) : {})}
        className="w-full rounded-lg border border-border bg-white px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-blue-200"
      />

      {error && (
        <p className="mt-1 text-sm text-expense">{error.message}</p>
      )}
    </div>
  );
};

export default Input;