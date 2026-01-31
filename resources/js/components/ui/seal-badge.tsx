import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SealBadgeProps extends React.ComponentProps<typeof Badge> {
    children: React.ReactNode;
}

export function SealBadge({ className, variant, children, ...props }: SealBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "bg-seal/10 text-seal border-seal/30 hover:bg-seal/20 transition-colors font-serif tracking-wide px-3 py-1",
                className
            )}
            {...props}
        >
            {children}
        </Badge>
    );
}
