import { AuthorizedAPIInstance, APIInstance } from "@/lib/axios";
import { type UploadPdfResponse } from "./types";

export const pdfAPI = {
  getAllPdfs: async () => {
    const response = await AuthorizedAPIInstance.get("/pdf/getAllPDFs");
    return response.data;
  },

  uploadPdf: async (formData: FormData): Promise<UploadPdfResponse> => {
    const res = await AuthorizedAPIInstance.post("/pdf/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getPresignedUrl: async (id: string): Promise<any> => {
    const res = await AuthorizedAPIInstance.post("/pdf/presignedUrl", { id });
    return res.data;
  },

  getSidebarCounts: async () => {
    const res = await AuthorizedAPIInstance.get("/sidebar-counts");
    return res.data;
  },

  inviteUserToPdf: (pdfId: string, email: string) => {
    return AuthorizedAPIInstance.post(`/pdf/${pdfId}/share`, { email });
  },

  getSharedPdf: async (token: string, userId: string | undefined) => {
    return APIInstance.get(`/share/${token}?userId=${userId}`).then(
      (res) => res.data,
    );
  },
};
