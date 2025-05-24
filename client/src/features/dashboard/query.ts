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

export const useSidebarCounts = () => {
    return useQuery({
        queryKey: ["sidebar-counts"],
        queryFn: pdfAPI.getSidebarCounts,
        refetchInterval: 10000,
    });
};

export const useSharedPdfQuery = (token: string, userId: string | undefined) => {
    return useQuery({
        queryKey: ["shared-pdf", token, userId],
        queryFn: () => pdfAPI.getSharedPdf(token, userId)
    });
};