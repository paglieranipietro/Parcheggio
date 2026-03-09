import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AccountSettings = ({ onClose }) => {
  const { user, updateUser, addLicensePlate, removeLicensePlate, selectLicensePlate } = useContext(AuthContext);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    username: user?.username || '',
    password: user?.password || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
  });
  const [editingField, setEditingField] = useState(null);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [plateMessage, setPlateMessage] = useState('');

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fieldLabels = {
    name: 'Nome',
    surname: 'Cognome',
    username: 'Nome Utente',
    password: 'Password',
    email: 'Email',
    phone: 'Numero di telefono',
    birthDate: 'Data di Nascita'
  };

  const handleSaveField = (field) => {
    updateUser({ [field]: editData[field] });
    setEditingField(null);
    setMessage(`${fieldLabels[field]} aggiornato con successo!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddPlate = () => {
    if (!newPlate.trim()) {
      setPlateMessage({ type: 'error', text: 'Inserisci una targa valida' });
      setTimeout(() => setPlateMessage(''), 3000);
      return;
    }
    
    // Verifica il formato della targa: 2 lettere + 3 numeri + 2 lettere
    const plateRegex = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    if (!plateRegex.test(newPlate)) {
      setPlateMessage({ type: 'error', text: 'Formato non valido. Usa: 2 lettere, 3 numeri, 2 lettere (es: AB123CD)' });
      setTimeout(() => setPlateMessage(''), 3000);
      return;
    }
    
    // Verifica che la targa non sia già presente
    if (user.licensePlates.some(p => p.plate === newPlate.toUpperCase())) {
      setPlateMessage({ type: 'error', text: 'Questa targa è già registrata' });
      setTimeout(() => setPlateMessage(''), 3000);
      return;
    }

    addLicensePlate(newPlate);
    setNewPlate('');
    setPlateMessage({ type: 'success', text: 'Targa aggiunta con successo!' });
    setTimeout(() => setPlateMessage(''), 3000);
  };

  const handleRemovePlate = (plateId) => {
    removeLicensePlate(plateId);
    setPlateMessage({ type: 'success', text: 'Targa rimossa con successo!' });
    setTimeout(() => setPlateMessage(''), 3000);
  };

  const handleSelectPlate = (plateId) => {
    selectLicensePlate(plateId);
    const selectedPlate = user.licensePlates.find(p => p.id === plateId);
    setPlateMessage({ type: 'success', text: `Targa ${selectedPlate.plate} selezionata` });
    setTimeout(() => setPlateMessage(''), 3000);
  };

  const handleCancelField = (field) => {
    setEditData(prev => ({
      ...prev,
      [field]: user[field]
    }));
    setEditingField(null);
  };

  const renderField = (label, field, type = 'text') => {
    const isEditing = editingField === field;
    let displayValue = editData[field];

    if (!isEditing && type === 'password') {
      displayValue = '•'.repeat(editData[field]?.length || 0);
    } else if (!isEditing && type === 'date') {
      displayValue = editData[field] ? new Date(editData[field]).toLocaleDateString('it-IT') : 'N/A';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSaveField(field);
      } else if (e.key === 'Escape') {
        handleCancelField(field);
      }
    };

    return (
      <div key={field}>
        <label className="block text-xs font-medium text-secondary mb-1">{label}</label>
        {isEditing ? (
          type === 'password' ? (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={editData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary pr-10"
                autoFocus
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:opacity-75 transition-opacity"
                type="button"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.707 6.707a3 3 0 010 4.242m7.829-7.828a3 3 0 010 4.242m-8.485 0a9.969 9.969 0 011.414-2.414M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <input
              type={type}
              value={editData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary"
              autoFocus
            />
          )
        ) : (
          <div className="relative">
            <div className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-sm text-primary break-all pr-20">
              {type === 'password' && !showPassword ? displayValue : editData[field] || 'N/A'}
            </div>
            {type === 'password' && (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white hover:opacity-75 transition-opacity"
                type="button"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.707 6.707a3 3 0 010 4.242m7.829-7.828a3 3 0 010 4.242m-8.485 0a9.969 9.969 0 011.414-2.414M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={() => setEditingField(field)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:opacity-75 transition-opacity"
              title="Modifica"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-lib-card rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all">
        
        <div className="bg-lib-primary px-4 py-3 flex justify-between items-center">
          <h3 className="text-base font-bold text-on-primary">Impostazioni Account</h3>
          <button 
            onClick={onClose}
            className="text-on-primary hover:opacity-75 transition-opacity text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[550px] overflow-y-auto">
          {message && (
            <div className="bg-lib-primary/20 border border-lib-primary text-white rounded-md px-3 py-2 text-xs">
              {message}
            </div>
          )}

          {renderField('Nome', 'name')}
          {renderField('Cognome', 'surname')}
          {renderField('Nome Utente', 'username')}
          {renderField('Password', 'password', 'password')}
          {renderField('Data di Nascita', 'birthDate', 'date')}
          {renderField('Email', 'email', 'email')}
          {renderField('Numero Telefono', 'phone', 'tel')}

          {/* Sezione Targhe */}
          <div className="border-t border-lib-border pt-4 mt-4">
            <h4 className="text-sm font-bold text-primary mb-3">Gestione Targhe</h4>
            
            {plateMessage && (
              <div className={`rounded-md px-3 py-2 text-xs mb-3 ${
                plateMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                {plateMessage.text}
              </div>
            )}

            {/* Input per aggiungere targa */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="AA123BB"
                maxLength="7"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlate()}
                className="flex-1 bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary font-mono"
                title="Formato: 2 lettere, 3 numeri, 2 lettere"
              />
              <button
                onClick={handleAddPlate}
                className="px-3 py-2 bg-lib-primary text-on-primary rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Aggiungi
              </button>
            </div>

            {/* Lista targhe */}
            {user.licensePlates && user.licensePlates.length > 0 ? (
              <div className="space-y-2">
                {user.licensePlates.map(plate => (
                  <div
                    key={plate.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      plate.isSelected
                        ? 'bg-lib-primary/20 border-lib-primary'
                        : 'bg-lib-secondary border-lib-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="radio"
                        name="selectedPlate"
                        checked={plate.isSelected}
                        onChange={() => handleSelectPlate(plate.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className={`font-mono font-bold ${
                        plate.isSelected ? 'text-lib-primary' : 'text-primary'
                      }`}>
                        {plate.plate}
                      </span>
                      {plate.isSelected && (
                        <span className="text-xs text-lib-primary font-medium">✓ Attiva</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemovePlate(plate.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Rimuovi targa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-lib-secondary border border-lib-border rounded-md text-center">
                <p className="text-tertiary text-sm">Nessuna targa registrata</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-lib-border">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-lib-secondary text-primary border border-lib-border rounded-md hover:bg-lib-secondary/80 transition-colors text-sm"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
