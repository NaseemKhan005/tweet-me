import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users/follow/${userId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data);

        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        throw error.message;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return { follow, isPending };
};

export default useFollow;
