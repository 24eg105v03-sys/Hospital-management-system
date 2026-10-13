import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

export default function AppLayout({ children, searchContent, actionContent }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-main">
        <AppHeader
          searchContent={searchContent}
          actionContent={actionContent}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
}
