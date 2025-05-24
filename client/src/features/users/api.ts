import { AuthorizedAPIInstance } from "@/lib/axios";
import { type UserSummary } from "./types";

export const usersAPI = {
  getAll: async (): Promise<{ users: UserSummary[] }> => {
    const res = await AuthorizedAPIInstance.get("/users");
    return res.data;
  },
};
