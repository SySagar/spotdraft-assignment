import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentAPI } from "./api";
import { type AddCommentPayload } from "./types";

export const useAddCommentMutation = (pdfId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AddCommentPayload) => commentAPI.add(pdfId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", pdfId] });
        },
    });
};
