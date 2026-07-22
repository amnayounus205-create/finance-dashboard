const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-card rounded-card shadow-card p-5 border border-border ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;