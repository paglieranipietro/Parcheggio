import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AccountSettings = ({ onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
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

        <div className="p-4 space-y-3">
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
