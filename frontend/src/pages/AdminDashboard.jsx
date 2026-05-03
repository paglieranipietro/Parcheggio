import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ParkingForm from '../components/admin/ParkingForm';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    /**
     * Verifica se l'utente dispone del ruolo di amministratore.
     * Il campo ruolo è allineato al database.
     */
    if (!user || user.ruolo !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-lib-dark flex flex-col p-6">
            <div className="flex justify-between items-center mb-6 bg-lib-card rounded-lg shadow border border-lib-border p-4 w-full transition-colors duration-300">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Pannello Amministratore</h1>
                    <p className="text-secondary text-sm">Sistema di Gestione Parcheggi - Ciao, {user?.name || user?.nome}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-on-primary font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Esci
                </button>
            </div>

            <div className="flex-1 w-full">
                <ParkingForm />
            </div>
        </div>
    );
}