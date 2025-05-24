import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pdfAPI } from "./api";

export const useUploadPdfMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pdfAPI.uploadPdf,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pdfs"] });
        },
    });
};

export const useInviteUserMutation = (pdfId: string, onSuccessCallback: (data: any) => void) => {
    return useMutation({
        mutationFn: (email: string) => pdfAPI.inviteUserToPdf(pdfId, email),
        onSuccess: (data) => {
            console.log("Invite response:", data);
            onSuccessCallback?.(data);
        },
    });
};