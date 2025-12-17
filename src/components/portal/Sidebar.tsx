import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  FileText,
  MessageSquare,
  GraduationCap,
  ShoppingCart,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientProfile } from '@/types/portal';
import giantsLogo from '@/assets/giants-logo.png';

interface SidebarProps {
  client: ClientProfile;
  onLogout?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'My Book Progress', path: '/progress' },
  { icon: Upload, label: 'Upload Materials', path: '/upload' },
  { icon: FileText, label: 'My Documents', path: '/documents' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: GraduationCap, label: 'Classes', path: '/classes' },
  { icon: ShoppingCart, label: 'Re-Order Books', path: '/reorder' },
];

export const Sidebar: React.FC<SidebarProps> = ({ client, onLogout }) => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-40">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-2">
          <img src={giantsLogo} alt="GIANTS" className="h-20 w-auto" />
          <p className="text-xs text-sidebar-foreground/60">Client Portal</p>
        </div>
      </div>

      {/* Client info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">
              {client.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{client.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{client.bookTitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'sidebar-item',
                    isActive && 'active'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'
                  )} />
                  <span className={cn(
                    'text-sm transition-colors',
                    isActive ? 'text-sidebar-primary-foreground font-medium' : 'text-sidebar-foreground'
                  )}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account/Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/account"
          className={({ isActive }) => cn('sidebar-item mb-1', isActive && 'active')}
        >
          <User className="w-5 h-5 text-sidebar-foreground/70" />
          <span className="text-sm text-sidebar-foreground">Account</span>
        </NavLink>
        <button
          onClick={onLogout}
          className="sidebar-item w-full text-left hover:bg-destructive/20"
        >
          <LogOut className="w-5 h-5 text-sidebar-foreground/70" />
          <span className="text-sm text-sidebar-foreground">Logout</span>
        </button>
      </div>
    </aside>
  );
};
