interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      {children}
    </button>
  );
};
