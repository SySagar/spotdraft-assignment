import { useCallback, useState } from "react";
import CommentEditor from "./CommentEditor";
import { Button } from "@/components/ui/button";

type Props = {
    onSubmit: (html: string) => void;
    allowCommenting?: boolean
};

export default function CommentInputPanel({ onSubmit }: Props) {
    const [commentHtml, setCommentHtml] = useState("");

    const handleSetContent = useCallback((content: any) => {
        setCommentHtml(content)
    }, [setCommentHtml])

    const handleSubmit = useCallback(() => {
        if (commentHtml.trim()) {
            onSubmit(commentHtml);
            setCommentHtml("");
        }
    }, [onSubmit, setCommentHtml, commentHtml])

    return (
        <div className="flex flex-col h-full w-full">

            <div className="flex-1 overflow-auto">
                <CommentEditor commentHtml={commentHtml} onContentChange={handleSetContent} />
            </div>

            <Button
                className="mt-4 self-end"
                disabled={!commentHtml}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    );
}
