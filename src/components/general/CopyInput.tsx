import { Check, Copy, LucideIcon } from "lucide-react";
import { useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

function CopyInput({ icon: Icon, value, className }: { icon: LucideIcon; value: string; className?: string }) {
    const [isCopied, setIsCopied] = useState(false);

    async function copyToClipboard() {
        await navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <InputGroup dir="ltr" className={className}>
            <InputGroupAddon>
                <Icon />
            </InputGroupAddon>
            <InputGroupInput value={value} readOnly />
            <InputGroupAddon align="inline-end">
                <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs" onClick={copyToClipboard}>
                    {isCopied ? <Check /> : <Copy />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default CopyInput;
