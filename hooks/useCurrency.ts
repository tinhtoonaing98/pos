import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const useCurrency = () => {
    const { settings } = useAppContext();

    const formatCurrency = useCallback((amount: number): string => {
        try {
            // Use undefined for locale to respect user's browser/OS settings for number formatting
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: settings.currencyCode,
            }).format(amount);
        } catch (error) {
            console.error(`Invalid currency code: ${settings.currencyCode}. Falling back to USD.`);
            // Fallback to USD in case of an invalid currency code
             return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);
        }
    }, [settings.currencyCode]);

    return { formatCurrency };
};
