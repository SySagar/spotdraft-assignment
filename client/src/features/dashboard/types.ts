export type PdfFile = {
    id: number;
    title: string;
    createdAt: string;
    fileUrl: string;
    ownerId: string;
};

export type PdfModal = {
    pdfUrl: string;
    onClose: () => void
}

export type UploadPdfResponse = {
    message: string;
    uploadedPdfs: {
        id: string;
        title: string;
        fileUrl: string;
        fileSize: string;
        fileType: string;
        createdAt: string;
    }[];
};

export type ViewMode = "list" | "grid";

export type InviteUser = {
    pdfId: string;
}


export type CommenEditor = {
    onContentChange: (content: string) => void;
    commentHtml?: string;
  };