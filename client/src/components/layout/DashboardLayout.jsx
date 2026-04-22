import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, isBlurred }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''} ${isBlurred ? 'blurred' : ''}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />

      <main style={{ overflowY: 'auto', flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
