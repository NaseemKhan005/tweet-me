import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { FaUser } from "react-icons/fa";

const RightPanel = () => {
  const { data: suggestedUsers, isPending } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users/suggested`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        return data.suggestedUsers;
      } catch (error) {
        throw error.message;
      }
    },
  });

  console.log(suggestedUsers);

  return (
    <div className="hidden lg:block my-4 mx-2 sticky top-4">
      <div className="bg-[#16181C] p-4 rounded-md">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-5 mt-5 w-80">
          {/* item */}
          {isPending && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {!isPending &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <span className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                      {user.profilePicture?.length ? (
                        <img src={user.profilePicture} alt="user" />
                      ) : (
                        <FaUser />
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName?.length > 20
                        ? `${user.fullName.slice(0, 20)}...`
                        : user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @
                      {user.username?.length > 20
                        ? `${user.username.slice(0, 20)}...`
                        : user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
