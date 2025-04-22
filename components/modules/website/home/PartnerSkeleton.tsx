const PartnerSkeleton = () => {
  return (
    <div className="px-2 sm:px-3 py-3 sm:py-4">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 w-full max-w-[300px] h-[160px] sm:h-[80px] animate-pulse">
        <div className="h-full flex flex-col">
          <div className="h-[60%] w-full bg-gray-200"></div>
          <div className="h-[25%] flex items-center justify-center">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSkeleton; 