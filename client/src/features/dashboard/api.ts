import { AuthorizedAPIInstance } from "@/lib/axios";

export const pdfAPI = {
    getAllPdfs: async () => {
        const response = await AuthorizedAPIInstance.get("/pdf/getAllPDFs");
        return response.data;
    },
};