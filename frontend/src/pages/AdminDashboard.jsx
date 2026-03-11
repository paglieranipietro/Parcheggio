import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ParkingForm from '../components/admin/ParkingForm';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    // Controllo di sicurezza: se non sei admin, torni alla dashboard utente o al login
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col p-6">
            {/* Intestazione (Header) per l'Admin */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4 w-full">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pannello Amministratore</h1>
                    <p className="text-gray-500 text-sm">Sistema di Gestione Parcheggi - Ciao, {user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Esci
                </button>
            </div>

            {/* Qui importiamo tutto il form/grafica della gestione */}
            <div className="flex-1 w-full">
                <ParkingForm />
            </div>
        </div>
    );
}