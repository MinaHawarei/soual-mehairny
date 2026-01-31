import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorityCardProps {
    name: string;
    role: string;
    date?: string;
    avatarUrl?: string; // Optional image URL
    fallbackParams?: string; // e.g. "FR" for Father Royce
    verified?: boolean;
    isArabicLocale?: boolean;
    className?: string;
}


export function AuthorityCard({
    name,
    role,
    date,
    avatarUrl,
    fallbackParams,
    verified = true,
    isArabicLocale = false,
    className
}: AuthorityCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isArabicLocale ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-lg border border-ornament/40 bg-paper/50 shadow-sm",
            className
        )}>
            <Avatar className="h-12 w-12 border-2 border-ornament">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="bg-paper-2 text-primary font-serif">
                    {fallbackParams || name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-foreground leading-none">{name}</h4>
                </div>
                <p className="text-sm text-muted-foreground font-reading">{role}</p>
                {date && <p className="text-sm text-muted-foreground font-reading">{formatDate(date)}</p>}


            </div>
        </div>
    );
}
