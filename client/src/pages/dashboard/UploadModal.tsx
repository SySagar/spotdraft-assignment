import { useState, useRef, type ChangeEvent, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadPdfMutation } from "@/features/dashboard/mutations";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function UploadModal({ open, onClose }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadPdf, isPending } = useUploadPdfMutation();

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []).filter(f => f.type === "application/pdf");
        setFiles((prev) => [...prev, ...selected]);
        if (e.target) {
            e.target.value = '';
        }
    }, [setFiles])

    const handleAddFilesClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef])

    const handleUpload = useCallback(() => {
        const formData = new FormData();
        files.forEach((file) => formData.append("pdfs", file));
        uploadPdf(formData, {
            onSuccess: () => {
                setFiles([]);
                onClose();
            },
        });
    }, [files, uploadPdf, setFiles, onClose])

    const handleRemoveFile = useCallback((index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }, [setFiles])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" /> Upload PDFs
                    </DialogTitle>
                </DialogHeader>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                />

                <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleAddFilesClick}
                >
                    + Add PDF Files
                </Button>

                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                                <FileText className="h-4 w-4 text-red-500" />
                                <span className="text-xs truncate max-w-[50px]">{file.name.slice(0, 5)}...</span>
                                <button onClick={() => handleRemoveFile(index)} className="text-xs text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    className="w-full mt-4"
                    disabled={files.length === 0 || isPending}
                    onClick={handleUpload}
                >
                    {isPending ? "Uploading..." : "Upload"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}