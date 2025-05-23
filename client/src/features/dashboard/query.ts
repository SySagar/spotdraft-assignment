import { useQuery } from "@tanstack/react-query";
import { pdfAPI } from "./api";

export const usePdfListQuery = () =>
    useQuery({
        queryKey: ["pdfs"],
        queryFn: pdfAPI.getAllPdfs,
    });
