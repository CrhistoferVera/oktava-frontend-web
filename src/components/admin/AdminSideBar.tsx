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
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}
export const AdminSideBar = () => {
  const { user, logout } = useAuth();

  const NAV_ITEMS: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      section: 'Principal',
    },
    {
      label: 'Pedidos',
      href: '/admin/mints',
      icon: <ScrollText className="w-5 h-5" />,
    },
    {
      label: 'Menu',
      href: '/admin/redeem',
      icon: <Drumstick className="w-5 h-5" />,
    },
    {
      label: 'Clientes',
      href: '/admin/kyc',
      icon: <User className="w-5 h-5" />,
    },
    {
      label: 'Historial',
      href: '/admin/logs',
      icon: <LineChart className="w-5 h-5" />,
      section: 'Sistema',
    },
    {
      label: 'Verificacion',
      href: '/admin/verification',
      icon: <Settings className="w-5 h-5" />,
    },
  ];
  return (
    <div className=" bg-[#161616] justify-between flex flex-col text-white w-[15%] overflow-auto ">

      <div className="border-b">
        <div className="text-4xl font-bold pb-1 pt-5 flex items-center justify-center gap-1">
          <p className="text-red-500">OK</p>
          <p className="text-white">TA</p>
          <p className="text-red-500">VA</p>
        </div>
        <p className=" text-gray-500 font-light text-center pb-3">
          SABOR PERUANO - ADMIN
        </p>
          
          
        
        
      </div>

      <div className="px-3 pb-5">
        <div className="border-t   border-gray-800 pt-4">
          <div className="flex  items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="font-semibold text-white text-sm">AD</span>
            </div>
            <div className="flex-1  min-w-0">
              <div className="font-medium text-white text-sm">
                {user?.firstName}
              </div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>

            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
