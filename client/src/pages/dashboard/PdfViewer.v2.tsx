"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  pdfUrl: string;
  onClose: () => void;
  title?: string;
};

const PdfIframe = ({ pdfUrl, onClose, title }: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [pdfUrl]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[90%] w-[90%] max-w-6xl flex-col rounded-lg bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-blue-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800">
              {title || "PDF Viewer"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-50">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          )}
          {pdfUrl && (
            <>
              <iframe
                title="pdf iframe"
                src={pdfUrl}
                width="100%"
                height="100%"
                className="pdf-iframe"
                onLoad={() => setLoading(false)}
                style={{}}
              />
            </>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white px-4 py-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Viewing document</span>
            <div className="flex items-center gap-4">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                Download
              </button>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfIframe;
