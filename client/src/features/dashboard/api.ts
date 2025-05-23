import { AuthorizedAPIInstance } from "@/lib/axios";
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
};