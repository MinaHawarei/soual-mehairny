import { cn } from "@/lib/utils";
import CopticCrossIcon from "@/components/CopticCrossIcon";

interface OrnamentDividerProps {
    className?: string;
}

export function OrnamentDivider({ className }: OrnamentDividerProps) {
    return (
        <div className={cn("flex items-center justify-center gap-4 py-8", className)}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-ornament to-transparent" />
            <CopticCrossIcon size={16} className="text-ornament/80 rotate-45" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-ornament to-transparent" />
        </div>
    );
}
