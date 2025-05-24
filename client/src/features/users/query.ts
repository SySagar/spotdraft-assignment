import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "./api";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersAPI.getAll,
  });
};
