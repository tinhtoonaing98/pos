import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const AdminSettings: React.FC = () => {
    const { settings, updateSettings, currencies } = useAppContext();

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSettings({ currencyCode: e.target.value });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-light mb-6">Settings</h2>
            <div className="bg-brand-secondary rounded-lg shadow-lg p-6 max-w-md">
                 <h3 className="text-xl font-bold text-brand-light mb-4">General Settings</h3>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="currency-select" className="block text-sm font-medium text-gray-300 mb-1">
                            Currency
                        </label>
                        <select
                            id="currency-select"
                            value={settings.currencyCode}
                            onChange={handleCurrencyChange}
                            className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 transition-colors"
                        >
                            {currencies.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.name} ({currency.symbol})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">
                            This will change the currency symbol and formatting across the entire application.
                        </p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminSettings;
