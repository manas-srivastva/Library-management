import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { userApi } from "@/api/usersApi";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.activateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deactivateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};