import { cn } from "@/lib/utils";
import CopticCrossIcon from "@/components/CopticCrossIcon";

interface OrnamentDividerProps {
    className?: string;
}

export function OrnamentDivider({ className }: OrnamentDividerProps) {
    return (
        <div className={cn("flex items-center justify-center gap-4 py-10 opacity-80", className)}>
            {/* Left Wing */}
            <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="text-ornament hidden sm:block">
                <path d="M100 6L0 6" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="6" r="2" fill="currentColor" />
                <path d="M90 6C80 6 75 1 65 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M90 6C80 6 75 11 65 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ornament to-transparent sm:hidden" />

            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-ornament/20 blur-xl rounded-full" />
                <CopticCrossIcon size={24} className="text-ornament relative z-10" />
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ornament to-transparent sm:hidden" />

            {/* Right Wing */}
            <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="text-ornament hidden sm:block transform scale-x-[-1]">
                <path d="M100 6L0 6" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="6" r="2" fill="currentColor" />
                <path d="M90 6C80 6 75 1 65 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M90 6C80 6 75 11 65 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
        </div>
    );
}
