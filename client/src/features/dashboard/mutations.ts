import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pdfAPI } from "./api";
import { toast } from "sonner";

export const useUploadPdfMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pdfAPI.uploadPdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdfs"] });
    },
  });
};

export const useInviteUserMutation = (
  pdfId: string,
  onSuccessCallback: (data: any) => void,
  onFailureCallback?: (error: any) => void,
) => {
  return useMutation({
    mutationFn: (email: string) => pdfAPI.inviteUserToPdf(pdfId, email),
    onSuccess: (data) => {
      console.log("Invite response:", data);
      onSuccessCallback?.(data);
    },
    onError: (res) => {
      toast.error("Failed to invite user");
      onFailureCallback?.(res);
    }
  });
};


export const useDeletePdfMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pdfId: string) => pdfAPI.deletePdf(pdfId),
    onSuccess: () => {
      toast.success("PDF deleted");
      queryClient.invalidateQueries({ queryKey: ["pdfs"] });
    },
    onError: () => {
      toast.error("Failed to delete PDF");
    },
  });
};