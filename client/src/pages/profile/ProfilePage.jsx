import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FaLink, FaUser } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useFollow from "../../hooks/useFollow";
import convertDate from "../../utils/convertDate";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const { username } = useParams();
  const { follow, isPending: isFollowing } = useFollow();

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isLoading = false;
  const isMyProfile = authUser?.user?.username === username;

  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users/profile/${username}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        throw error.message;
      }
    },
  });

  const { mutate: editProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users/update`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coverPicture: coverImg,
              profilePicture: profileImg,
            }),
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw error.message;
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setCoverImg(null);
      setProfileImg(null);
      refetch();
    },
  });

  useEffect(() => {
    refetch();
  }, [username, feedType, refetch]);

  const { formattedDate } = convertDate(data?.user?.createdAt);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen pb-10">
        {/* HEADER */}
        {(!isLoading || !isRefetching) && !authUser?.user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        <div className="flex flex-col">
          {!isLoading && !isRefetching && authUser?.user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{data?.user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>

              {/* COVER IMG */}
              <div className="relative bg-white/5 h-60 flex items-center justify-center">
                {data?.user?.profilePicture?.length ? (
                  <img
                    src={coverImg || data?.user?.coverPicture || "/cover.png"}
                    className="h-60 w-full object-cover"
                    alt="cover image"
                  />
                ) : (
                  <div className="flex items-center justify-center flex-col gap-5 mb-5 text-neutral-500">
                    <GrGallery className="text-5xl" />
                    {isMyProfile ? (
                      <p>
                        No cover image found. Click here to upload a cover image
                      </p>
                    ) : (
                      <p>No cover image found.</p>
                    )}
                  </div>
                )}

                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                {isMyProfile && (
                  <>
                    <input
                      type="file"
                      ref={coverImgRef}
                      onChange={(e) => handleImgChange(e, "coverImg")}
                      className="cursor-pointer absolute opacity-0 top-0 left-0 w-full h-full"
                    />
                    <input
                      type="file"
                      hidden
                      ref={profileImgRef}
                      onChange={(e) => handleImgChange(e, "profileImg")}
                    />
                  </>
                )}

                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <span className="w-32 aspect-square rounded-full flex items-center justify-center relative group/avatar bg-zinc-900">
                    {profileImg || data?.user?.profilePicture ? (
                      <img
                        src={
                          profileImg ||
                          data?.user?.profilePicture ||
                          "/avatar-placeholder.png"
                        }
                      />
                    ) : (
                      <FaUser className="text-7xl text-neutral-300" />
                    )}
                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      </div>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}

                {!isMyProfile && (
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(data?.user?._id);
                    }}
                  >
                    {isFollowing ? (
                      <LoadingSpinner />
                    ) : authUser?.user?.following?.includes(data?.user?._id) ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </button>
                )}

                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => editProfileMutation()}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">
                    {data?.user?.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{data?.user?.username}
                  </span>
                  <span className="text-sm my-1">{data?.user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {data?.user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          youtube.com/@asaprogrammer_
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      Joined {formattedDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {data?.user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {data?.user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("liked posts")}
                >
                  Liked Posts
                  {feedType === "liked posts" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading && isRefetching ? (
          <ProfileHeaderSkeleton />
        ) : (
          <>
            <Posts
              feedType={feedType}
              username={data?.user?.username}
              userId={data?.user?._id}
            />
          </>
        )}
      </div>
    </>
  );
};
export default ProfilePage;
