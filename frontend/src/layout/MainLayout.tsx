import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Potentially a global header/navbar here */}
      <main className="flex-1">
        <Outlet /> {/* Renders the current route's component */}
      </main>
      {/* Potentially a global footer here */}
    </div>
  );
};

export default MainLayout;
