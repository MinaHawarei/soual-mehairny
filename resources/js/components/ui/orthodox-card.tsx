import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface OrthodoxCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "ornate";
}

const OrthodoxCard = forwardRef<HTMLDivElement, OrthodoxCardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg border bg-card text-card-foreground shadow-parchment transition-all duration-300",
                    variant === "ornate" && "border-2 border-gold/40 relative overflow-hidden",
                    className
                )}
                {...props}
            >
                {variant === "ornate" && (
                    <>
                        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29xvciIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMCAwbDEwIDEwTTAgMTBsMTAtMTAiLz48L3N2Zz4=')] text-gold" />
                        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29xvciIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMjQgMGwtMTAgMTBNMjQgMTBsLTEwLTEwIi8+PC9zdmc+')] text-gold" />
                    </>
                )}
                {children}
            </div>
        );
    }
);
OrthodoxCard.displayName = "OrthodoxCard";

export { OrthodoxCard };
