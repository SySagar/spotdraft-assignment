import { useCallback, useMemo, useState } from "react";
import {
  FileText,
  Grid3X3,
  List,
  MoreHorizontal,
  Search,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadModal from "./UploadModal";
import { Card, CardContent } from "@/components/ui/card";

import {
  usePresignedPdfUrl,
  usePdfListQuery,
} from "@/features/dashboard/query";
import { formatDate } from "@/lib/utils";
import PdfModal from "./PdfViewer";
// import PdfIframe from "./PdfViewer.v2"
import { pdfAPI } from "@/features/dashboard/api";
import { type PdfFile, type ViewMode } from "@/features/dashboard/types";

import { useUploadPdfMutation, useDeletePdfMutation } from "@/features/dashboard/mutations";
import { useDebounce } from "@/hooks/useDebounce";

function PDFListView({
  files,
  handleSelectPdf,
  deletePdf
}: {
  files: PdfFile[];
  handleSelectPdf: any;
  deletePdf: any;
}) {

  const handleDownloadPdf = async (pdfId: string, filename: string) => {
    try {
      const { url } = await pdfAPI.getPresignedUrl(pdfId); // this gives you a direct S3 URL

      // Fetch as Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // cleanup
    } catch (err) {
      console.error("Download failed", err);
    }
  };



  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium">{file.title}</h3>
              <p className="text-sm text-muted-foreground">
                Uploaded: {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleSelectPdf(file?.id)}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              Preview
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleDownloadPdf(String(file.id), file.title)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem> */}
                <DropdownMenuItem className="text-destructive"
                  onClick={() => deletePdf(file.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

function PDFGridView({
  files,
  handleSelectPdf,
  deletePdf
}: {
  files: PdfFile[];
  handleSelectPdf: any;
  deletePdf: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file) => (
        <Card
          key={file.id}
          className="group cursor-pointer transition-all hover:shadow-md"
        >
          <CardContent className="p-4">
            <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-red-50">
              <FileText className="h-12 w-12 text-red-600" />
            </div>
            <div className="space-y-1">
              <h3 className="truncate text-sm font-medium" title={file.title}>
                {file.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDate(file.createdAt)}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button
                onClick={() => handleSelectPdf(file?.id)}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-blue-600"
              >
                Preview
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => deletePdf(file.id)}
                    className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: presignedUrlData, isSuccess } = usePresignedPdfUrl(
    selectedPdfId as string,
    modalOpen,
  );
  const { data: allPdfData, isLoading, isError } = usePdfListQuery();
  const { mutate: deletePdf } = useDeletePdfMutation();
  const { isPending } = useUploadPdfMutation();

  // const handleUploadClick = useCallback(() => {
  //     const input = document.createElement("input");
  //     input.type = "file";
  //     input.accept = "application/pdf";
  //     input.multiple = true;

  //     input.onchange = () => {
  //         const files = input.files;
  //         if (!files || files.length === 0) return;

  //         const formData = new FormData();
  //         for (const file of Array.from(files)) {
  //             if (file.type !== "application/pdf") {
  //                 alert("Only PDF files are allowed.");
  //                 return;
  //             }
  //             formData.append("pdfs", file);
  //         }

  //         uploadPdf(formData);
  //     };

  //     input.click();
  // }, [uploadPdf]);

  const handleSelectPdf = useCallback(
    (id: string) => {
      setModalOpen(true);
      setSelectedPdfId(id);
    },
    [setModalOpen, setSelectedPdfId],
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setSelectedPdfId(null);
  }, [setModalOpen, setSelectedPdfId]);

  const handleModalOpen = useCallback(() => {
    setUploadModalOpen(true);
  }, [setUploadModalOpen]);

  const handleSearchPdf = useCallback(
    (e: any) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  const filteredPdfs = useMemo(() => {
    if (debouncedSearch !== "")
      return (
        allPdfData?.pdfs?.filter((pdf: any) =>
          pdf.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
        ) ?? []
      );

    return allPdfData?.pdfs ?? [];
  }, [debouncedSearch, allPdfData]);

  console.log("Filtered PDFs:", filteredPdfs);

  const buttonState = useMemo(() => {
    return isPending ? "Uploading..." : "Upload PDF";
  }, [isPending]);

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading PDFs...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load PDFs.</p>;

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Hello from dashboard</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your PDFs</h2>
            <div className="flex items-center gap-2">
              <Button
                className="gap-2"
                onClick={handleModalOpen}
                disabled={isPending}
              >
                <Upload className="h-4 w-4" />
                {buttonState}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search PDFs..."
                value={searchQuery}
                onChange={handleSearchPdf}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredPdfs.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No PDFs found matching your search.
            </div>
          ) : viewMode === "list" ? (
            <PDFListView
              files={filteredPdfs}
              handleSelectPdf={handleSelectPdf}
              deletePdf={deletePdf}
            />
          ) : (
            <PDFGridView
              files={filteredPdfs}
              handleSelectPdf={handleSelectPdf}
              deletePdf={deletePdf}
            />
          )}
        </div>

        {selectedPdfId && isSuccess && (
          <PdfModal
            pdfUrl={presignedUrlData.url}
            onClose={handleClose}
            selectedPdfId={selectedPdfId}
            modalOpen={modalOpen}
          />
          // <PdfIframe pdfUrl={presignedUrlData.url} onClose={handleClose} />
        )}
        <UploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      </div>
    </div>
  );
}
