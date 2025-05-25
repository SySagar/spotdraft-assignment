import { useQuery } from "@tanstack/react-query";
import { commentAPI } from "./api";

export const useComments = (pdfId: string, enabled = true) =>
  useQuery({
    queryKey: ["comments", pdfId],
    queryFn: () => commentAPI.list(pdfId).then((res) => res.data.comments),
    enabled,
  });
