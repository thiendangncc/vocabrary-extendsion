const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-8 h-8 border-4 border-primary border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
