import { useEffect, useState, useRef } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const pdfjsLibUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const pdfjsWorkerUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

type Props = {
  pdfUrl: string
  onClose: () => void
}

export default function PdfModal({ pdfUrl, onClose }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState<any>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [baseScale, setBaseScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  const renderPage = (page: any) => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    const container = containerRef.current

    const containerWidth = container.clientWidth - 32
    const containerHeight = container.clientHeight - 80

    const viewport = page.getViewport({ scale: baseScale })

    const scaleX = containerWidth / viewport.width
    const scaleY = containerHeight / viewport.height
    const scale = Math.min(scaleX, scaleY, 2)

    setBaseScale(scale)

    const finalScale = scale * zoomLevel

    const scaledViewport = page.getViewport({ scale: finalScale })

    canvas.width = scaledViewport.width
    canvas.height = scaledViewport.height

    canvas.style.width = `${scaledViewport.width}px`
    canvas.style.height = `${scaledViewport.height}px`

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    }

    const renderTask = page.render(renderContext)
    renderTask.promise.then(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (pdfDoc && pageNumber) {
      setIsLoading(true)
      pdfDoc.getPage(pageNumber).then((page: any) => {
        setCurrentPage(page)
        renderPage(page)
      })
    }
  }, [pageNumber, pdfDoc])

  useEffect(() => {
    if (currentPage) {
      setIsLoading(true)
      renderPage(currentPage)
    }
  }, [currentPage, zoomLevel])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = pdfjsLibUrl
    script.onload = () => {
      // @ts-ignore
      const pdfjsLib = window["pdfjsLib"]
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      loadingTask.promise
        .then((pdf: any) => {
          setPdfDoc(pdf)
          setNumPages(pdf.numPages)

          pdf.getPage(1).then((page: any) => {
            setCurrentPage(page)
            renderPage(page)
          })
        })
        .catch((err: any) => {
          console.error("Error loading PDF:", err)
          setIsLoading(false)
        })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [pdfUrl])

  useEffect(() => {
    const handleResize = () => {
      if (currentPage) {
        renderPage(currentPage)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentPage])

  const handlePrevious = () => {
    setPageNumber((p) => Math.max(1, p - 1))
  }

  const handleNext = () => {
    setPageNumber((p) => Math.min(numPages ?? p, p + 1))
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="flex h-[90%] w-[90%] max-w-7xl rounded-lg bg-white shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: PDF View */}
        <div className="w-2/3 flex flex-col border-r bg-gray-50">

          <div ref={containerRef} className="flex-1 p-4 flex flex-col overflow-hidden">

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                  title="Zoom Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                  title="Zoom In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="ml-2 px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
                  title="Fit to Screen"
                >
                  Fit to Screen
                </button>
              </div>
              <div className="text-sm text-gray-500">{numPages ? `${pageNumber} of ${numPages}` : "Loading..."}</div>
            </div>

            <div
              ref={pdfContainerRef}
              className="flex-1 overflow-auto flex items-center justify-center"
              style={{
                cursor: zoomLevel > 1 ? "move" : "default",
              }}
            >
              <div className="relative flex items-center justify-center min-h-full">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full shadow-lg bg-white"
                  style={{
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={pageNumber <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-4">
              {numPages && numPages > 1 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(numPages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setPageNumber(page)}
                        className={`w-8 h-8 text-xs rounded ${page === pageNumber ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  {numPages > 5 && <span className="text-gray-400 px-2">...</span>}
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={pageNumber >= (numPages ?? 1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-md transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Comment Editor */}
        <div className="w-1/3 p-6 flex flex-col bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leave a comment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 border border-gray-200 rounded-lg p-3 mb-4 overflow-auto bg-gray-50 focus-within:bg-white focus-within:border-blue-300 transition-colors">
            <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log("Comment saved:", editor?.getHTML())
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              Save Comment
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
