import { AuthorizedAPIInstance } from "@/lib/axios";
import { type AddCommentPayload } from "./types";

export const commentAPI = {
  add: async (id: string, payload: AddCommentPayload) =>
    await AuthorizedAPIInstance.post(`/pdf/comment/${id}`, payload),

  list: async (id: string) =>
    await AuthorizedAPIInstance.get(`/pdf/comment/${id}`),
};
