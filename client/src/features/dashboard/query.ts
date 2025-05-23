import { useQuery } from "@tanstack/react-query";
import { pdfAPI } from "./api";

export const usePresignedPdfUrl = (id: string, enabled: boolean) =>
    useQuery({
        queryKey: ["pdf-url", id],
        queryFn: () => pdfAPI.getPresignedUrl(id),
        enabled,
    });

export const usePdfListQuery = () =>
    useQuery({
        queryKey: ["pdfs"],
        queryFn: pdfAPI.getAllPdfs,
    });