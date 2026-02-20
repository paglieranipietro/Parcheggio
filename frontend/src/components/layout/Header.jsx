import React from 'react';

const Header = ({ title, user }) => {
  return (
    <header className="bg-lib-card shadow-md border-b border-lib-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-lib-primary">{title}</h1>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-primary font-medium">Ciao, {user.name}!</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
