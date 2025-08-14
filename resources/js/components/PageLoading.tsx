import LoadingSpinner from './LoadingSpinner';

interface PageLoadingProps {
    text?: string;
    className?: string;
}

export default function PageLoading({ text, className = '' }: PageLoadingProps) {
    return (
        <div className={`min-h-screen flex items-center justify-center ${className}`}>
            <div className="text-center">
                <LoadingSpinner size="lg" text={text} />
                <div className="mt-4">
                    <div className="animate-pulse">
                        <div className="h-2 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-24 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
