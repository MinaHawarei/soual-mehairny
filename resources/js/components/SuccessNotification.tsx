import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SuccessNotificationProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    className?: string;
}

export default function SuccessNotification({
    message,
    isVisible,
    onClose,
    duration = 5000,
    className = '',
}: SuccessNotificationProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
                isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } ${className}`}
        >
            <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-green-800">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={() => {
                                setIsAnimating(false);
                                setTimeout(onClose, 300);
                            }}
                            className="inline-flex text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

