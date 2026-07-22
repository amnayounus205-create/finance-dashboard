const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) => {
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white",
    success: "bg-income hover:bg-green-700 text-white",
    danger: "bg-expense hover:bg-red-700 text-white",
    warning: "bg-budget hover:bg-yellow-600 text-white",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-lg font-medium shadow transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;