import React from 'react';

interface CopticCrossIconProps {
    className?: string;
    size?: number; // الحجم بالعناصر Tailwind ممكن تتجاهله أو تستخدمه
}

export default function CopticCrossIcon({ className = '', size = 32 }: CopticCrossIconProps) {
    return (
        <img
            src="/Coptic_cross.png"
            alt="Coptic Cross"
            className={`${className}`}
            style={{ width: size, height: size }}
        />
    );
}
