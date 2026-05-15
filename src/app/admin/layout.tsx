'use client'

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSideBar } from "@/components/admin/AdminSideBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    if (isLoading) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role !== "ADMIN") {
      router.replace("/");
    } else if (pathname === "/admin") {
      router.replace("/admin/dashboard");
    }
  }, [user, isLoading, router, pathname]);

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-[15%]">
        {/* Topbar móvil */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#161616] border-b border-gray-800 flex items-center px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-xl font-bold">
            <span className="text-red-500">OK</span>
            <span className="text-white">TA</span>
            <span className="text-red-500">VA</span>
          </span>
        </div>

        <div className="p-4 lg:p-6 pt-[72px] md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
