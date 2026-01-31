import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface OrnamentFrameProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "gold" | "simple";
}

const CornerOrnament = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-8 h-8 text-ornament absolute", className)}
    >
        <path d="M2 2V10C2 10 2 12 4 12C6 12 6 10 6 10V6H10C10 6 12 6 12 4C12 2 10 2 10 2H2Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M2 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export function OrnamentFrame({ children, className, variant = "default", ...props }: OrnamentFrameProps) {
    return (
        <div
            className={cn(
                "relative p-8 border border-ornament/30 rounded-lg bg-card/50",
                "before:absolute before:inset-1 before:border before:border-ornament/20 before:rounded-[4px] before:pointer-events-none",
                className
            )}
            {...props}
        >
            {/* Top Left */}
            <CornerOrnament className="top-1 left-1" />

            {/* Top Right */}
            <CornerOrnament className="top-1 right-1 rotate-90" />

            {/* Bottom Right */}
            <CornerOrnament className="bottom-1 right-1 rotate-180" />

            {/* Bottom Left */}
            <CornerOrnament className="bottom-1 left-1 -rotate-90" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
