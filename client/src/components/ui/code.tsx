import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


interface CopyCodeBoxProps {
    value: string
    className?: string
    label?: string
}

export function CopyCodeBox({ value, className, label }: CopyCodeBoxProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
           
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && <p className="text-sm font-medium text-foreground">{label}</p>}
            <div className="relative">
                <div className="flex items-center justify-between rounded-lg border bg-muted p-3 pr-12">
                    <code className="text-sm font-mono text-foreground break-all">{value}</code>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 h-8 w-8 p-0 hover:bg-background"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy to clipboard</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
