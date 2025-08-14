import { Fragment } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, XCircle, CheckCircle } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    variant = 'danger',
    isLoading = false,
}: ConfirmationDialogProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: Trash2,
                    iconColor: 'text-red-600',
                    buttonColor: 'bg-red-600 hover:bg-red-700',
                    iconBg: 'bg-red-100',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-yellow-600',
                    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
                    iconBg: 'bg-yellow-100',
                };
            case 'info':
                return {
                    icon: CheckCircle,
                    iconColor: 'text-blue-600',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700',
                    iconBg: 'bg-blue-100',
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-gray-600',
                    buttonColor: 'bg-gray-600 hover:bg-gray-700',
                    iconBg: 'bg-gray-100',
                };
        }
    };

    const styles = getVariantStyles();
    const IconComponent = styles.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${styles.iconBg}`}>
                            <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
                        </div>
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-600 mt-2">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {cancelText || 'Cancel'}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 text-white ${styles.buttonColor}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                {confirmText || 'Confirm'}
                            </div>
                        ) : (
                            confirmText || 'Confirm'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

