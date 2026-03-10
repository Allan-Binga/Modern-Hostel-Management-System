function Spinner({ size = "medium" }) {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-6",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`border-t-transparent border-solid border-[#800020] rounded-full animate-spin ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
}

export default Spinner;
