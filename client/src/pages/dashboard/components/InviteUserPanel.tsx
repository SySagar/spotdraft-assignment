import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { CopyCodeBox } from "@/components/ui/code";
import { useInviteUserMutation } from "@/features/dashboard/mutations";
import { type InviteUser } from "@/features/dashboard/types";

export default function InviteUserDialog({ pdfId }: InviteUser) {
    const [email, setEmail] = useState("");
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    const handleSucess = (res: any) => {
        {
            console.log(res)
            if (res) {
                const token = res?.data?.token;
                if (token) {
                    const link = `${window.location.origin}/share/${token}`;
                    setShareUrl(link);
                }
                setEmail("");
            }
        }
    }

    const { mutate: inviteUser, isPending, isSuccess, isError } = useInviteUserMutation(pdfId, handleSucess);

    const handleInvite = () => {
        if (email.trim()) {
            inviteUser(email,);
        }
    };

    console.log('link', shareUrl)
    return (
        <Dialog onOpenChange={(open) => !open}>
            <DialogTrigger asChild>
                <Button variant="link">Invite User</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a user by email</DialogTitle>
                    <DialogDescription>Send a sharing invite to someone by email.</DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                    />
                    <Button disabled={isPending || !email} onClick={handleInvite}>
                        {isPending ? "Inviting..." : "Invite"}
                    </Button>
                </div>

                {isSuccess && <p className="text-xs text-green-600 mt-2">User invited!</p>}
                {isError && <p className="text-xs text-red-500 mt-2">Invite failed.</p>}

                {shareUrl && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Share this link:</p>
                        <CopyCodeBox className="block w-full p-2 bg-muted rounded-md whitespace-pre-wrap text-sm"
                            value={shareUrl}
                        >
                            {shareUrl}
                        </CopyCodeBox>
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
