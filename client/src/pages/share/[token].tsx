import { useNavigate, useParams } from "react-router-dom";
import { useSharedPdfQuery } from "@/features/dashboard/query";
import PdfModal from "../dashboard/PdfViewer";
import { useUserStore } from "@/store/userStore";

export default function SharePdfPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  console.log("user", user);

  const {
    data,
    isLoading,
    error: isError,
  } = useSharedPdfQuery(token as string, user?.id);

  if (isLoading) return <div className="p-4">Loading shared PDF...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Invalid or expired link</div>;

  return (
    <div className="h-screen w-screen">
      <PdfModal
        pdfUrl={data.fileUrl}
        selectedPdfId={data.id}
        onClose={() => navigate("/dashboard")}
        modalOpen={true}
        allowCommenting={data.allowCommenting}
      />
    </div>
  );
}
