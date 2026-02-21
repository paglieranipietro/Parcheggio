import { useState } from 'react';
import ParkingForm from './components/admin/ParkingForm';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'parking') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <ParkingForm />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
          Parking System
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl text-white/95 font-semibold drop-shadow-lg mb-4">
          Sistema di Gestione Parcheggi
        </p>
        <button
          onClick={() => setCurrentPage('parking')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
        >
          Gestisci Parcheggi
        </button>
      </div>
    </div>
  )
}

export default App
