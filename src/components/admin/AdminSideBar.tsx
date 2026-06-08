'use client';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  BarChart3,
  ScrollText,
  Drumstick,
  User,
  LineChart,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSideBar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard',     href: '/admin/dashboard',     icon: <BarChart3   className="w-5 h-5" />, section: 'Principal' },
    { label: 'Pedidos',       href: '/admin/orders',        icon: <ScrollText  className="w-5 h-5" /> },
    { label: 'Menú',          href: '/admin/menu',          icon: <Drumstick   className="w-5 h-5" /> },
    { label: 'Categorías',    href: '/admin/categories',   icon: <Drumstick   className="w-5 h-5" /> },
    { label: 'Clientes',      href: '/admin/clients',       icon: <User        className="w-5 h-5" /> },
    { label: 'Administradores', href: '/admin/admins',        icon: <ShieldCheck className="w-5 h-5" />, section: 'Sistema' },
    { label: 'Reportes',       href: '/admin/reports',       icon: <LineChart   className="w-5 h-5" /> },
    { label: 'Configuración',  href: '/admin/configuration', icon: <Settings    className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const content = (
    <>
      {/* Logo */}
      <div className="border-b border-gray-800">
        <div className="text-4xl font-bold pb-1 pt-5 flex items-center justify-center gap-1">
          <p className="text-red-500">OK</p>
          <p className="text-white">TA</p>
          <p className="text-red-500">VA</p>
        </div>
        <p className="text-gray-500 font-light text-center pb-3 text-sm">
          SABOR PERUANO - ADMIN
        </p>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <div key={item.href}>
              {item.section && (
                <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider px-3 pt-5 pb-2">
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'border-l-4 border-red-600 bg-red-950/40 text-white rounded-l-none'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-5 mt-auto">
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">{user?.firstName}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            <button onClick={() => logout()} className="text-red-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: sidebar fijo */}
      <div className="hidden md:flex bg-[#161616] flex-col text-white w-[15%] h-screen fixed top-0 left-0 overflow-hidden">
        {content}
      </div>

      {/* Mobile: drawer deslizante */}
      <div
        className={`fixed md:hidden inset-y-0 left-0 z-40 w-64 bg-[#161616] flex flex-col text-white overflow-auto
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {content}
      </div>
    </>
  );
};
