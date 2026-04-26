import { User, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProfilePicProps = {
    image: File | string | undefined;
    setImage: (image: File | string | undefined) => void;
};

function ProfilePic({ image, setImage }: ProfilePicProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function getImageSrc() {
        if (!image) return undefined;
        if (typeof image === "string") return image;
        return URL.createObjectURL(image);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    }

    function handleImageRemove() {
        setImage(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleTrigger() {
        fileInputRef.current?.click();
    }

    const isImage = Boolean(image);
    const isFile = image instanceof File;

    return (
        <div className="relative">
            <div className={cn("group/avatar relative h-15 w-15 cursor-pointer overflow-hidden rounded-full border transition-colors", isImage ? "border-solid" : "border-dashed")} onClick={handleTrigger}>
                {isImage && <img src={getImageSrc()} alt="Avatar" className="h-full w-full object-cover" />}
                {!isImage && (
                    <div className="flex h-full w-full items-center justify-center">
                        <User className="text-muted-foreground size-6" />
                    </div>
                )}
            </div>
            {isFile && (
                <Button type="button" variant="outline" size="icon-xs" onClick={handleImageRemove} className="absolute -top-1 -right-1 z-10">
                    <X />
                </Button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept=".png,.jpg,.jpeg,.webp" className="hidden" />
        </div>
    );
}

export default ProfilePic;
