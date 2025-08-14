/**
 * Coptic Christian theme configuration
 * Defines colors, gradients, and design tokens inspired by Coptic Christian art and tradition
 */

export const theme = {
    colors: {
        // Primary Coptic colors
        primary: {
            gold: '#D4AF37',      // Rich gold for highlights and accents
            deepRed: '#8B0000',   // Deep red for primary actions
            royalBlue: '#1E3A8A', // Royal blue for secondary elements
            darkBlue: '#0F172A',  // Very dark blue for text and backgrounds
        },
        // Secondary colors
        secondary: {
            cream: '#FEF7E0',     // Light cream for backgrounds
            warmGray: '#6B7280',  // Warm gray for secondary text
            lightGold: '#F4E4BC', // Light gold for subtle backgrounds
            burgundy: '#7F1D1D',  // Burgundy for hover states
        },
        // Semantic colors
        semantic: {
            success: '#059669',   // Green for success states
            warning: '#D97706',   // Orange for warnings
            error: '#DC2626',     // Red for errors
            info: '#2563EB',      // Blue for information
        },
        // Neutral colors
        neutral: {
            white: '#FFFFFF',
            gray: {
                50: '#F9FAFB',
                100: '#F3F4F6',
                200: '#E5E7EB',
                300: '#D1D5DB',
                400: '#9CA3AF',
                500: '#6B7280',
                600: '#4B5563',
                700: '#374151',
                800: '#1F2937',
                900: '#111827',
            },
        },
    },
    
    gradients: {
        // Soft gradients for backgrounds
        primary: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)',
        secondary: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
        background: 'linear-gradient(180deg, #FEF7E0 0%, #FFFFFF 100%)',
        card: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        button: 'linear-gradient(135deg, #8B0000 0%, #DC2626 100%)',
        buttonHover: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)',
    },
    
    shadows: {
        // Subtle shadows for depth
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // Custom Coptic-themed shadows
        coptic: '0 4px 20px rgba(212, 175, 55, 0.15)',
        copticHover: '0 8px 30px rgba(212, 175, 55, 0.25)',
    },
    
    spacing: {
        // Consistent spacing scale
        xs: '0.25rem',   // 4px
        sm: '0.5rem',    // 8px
        md: '1rem',      // 16px
        lg: '1.5rem',    // 24px
        xl: '2rem',      // 32px
        '2xl': '3rem',   // 48px
        '3xl': '4rem',   // 64px
    },
    
    borderRadius: {
        // Rounded corners for modern look
        sm: '0.375rem',  // 6px
        md: '0.5rem',    // 8px
        lg: '0.75rem',   // 12px
        xl: '1rem',      // 16px
        '2xl': '1.5rem', // 24px
        full: '9999px',  // Full rounded
    },
    
    transitions: {
        // Smooth transitions for interactions
        fast: '150ms ease-in-out',
        normal: '250ms ease-in-out',
        slow: '350ms ease-in-out',
    },
    
    typography: {
        // Font weights and sizes
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        },
        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
        },
    },
} as const;

/**
 * Get CSS custom properties for the theme
 * @returns string - CSS custom properties string
 */
export function getThemeCSSVariables(): string {
    return `
        :root {
            --color-primary-gold: ${theme.colors.primary.gold};
            --color-primary-deep-red: ${theme.colors.primary.deepRed};
            --color-primary-royal-blue: ${theme.colors.primary.royalBlue};
            --color-primary-dark-blue: ${theme.colors.primary.darkBlue};
            --color-secondary-cream: ${theme.colors.secondary.cream};
            --color-secondary-warm-gray: ${theme.colors.secondary.warmGray};
            --color-secondary-light-gold: ${theme.colors.secondary.lightGold};
            --color-secondary-burgundy: ${theme.colors.secondary.burgundy};
        }
    `;
}
