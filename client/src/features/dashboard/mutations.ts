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
