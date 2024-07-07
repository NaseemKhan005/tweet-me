const RightPanelSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center justify-between w-full">
        <div className="skeleton w-10 aspect-square rounded-full shrink-0"></div>
        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-20 rounded-full"></div>
            <div className="skeleton h-2.5 w-28 rounded-full"></div>
          </div>
          <div className="skeleton h-8 w-16 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
export default RightPanelSkeleton;
