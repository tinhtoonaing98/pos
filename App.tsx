import React from 'react';
import { useAppContext } from './contexts/AppContext';
import LoginPage from './views/LoginPage';
import PosView from './views/PosView';
import AdminView from './views/AdminView';

const App: React.FC = () => {
    const { currentUser, adminView } = useAppContext();
    
    if (!currentUser) {
        return <LoginPage />;
    }

    if (currentUser.role === 'admin' && adminView === 'admin') {
        return <AdminView />;
    }

    return <PosView />;
};

export default App;
