import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LOGO_URL } from '../constants';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (!success) {
            setError('Invalid username or password.');
        } else {
            setError('');
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center font-sans">
            <div className="bg-brand-secondary p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
                <img src={LOGO_URL} alt="Htoo Myat Logo" className="w-24 h-24 mx-auto mb-4 rounded-full" />
                <h1 className="text-3xl font-bold text-brand-light tracking-wider mb-6">Htoo Myat POS</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-brand-light text-sm font-bold mb-2 text-left" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 transition-colors"
                            placeholder="admin or user"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-brand-light text-sm font-bold mb-2 text-left" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 transition-colors"
                            placeholder="admin123 or user123"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors text-lg"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;