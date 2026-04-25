"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { UserCircle2, User, MapPin, LogOut, ChevronDown, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function UserMenuDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // No autenticado → botón simple de "Ingresar"
  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
      >
        <UserCircle2 size={16} />
        <span className="hidden md:inline">Ingresar</span>
      </Link>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
        aria-label="Menú de usuario"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-red-600/80 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[96px] truncate text-sm font-semibold md:block">
          {user.firstName}
        </span>
        <ChevronDown
          size={14}
          className={`hidden md:block text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/60 overflow-hidden z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-sm font-semibold text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <User size={15} className="text-zinc-500" />
              Ver perfil
            </Link>
            <Link
              href="/addresses"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <MapPin size={15} className="text-zinc-500" />
              Mis direcciones
            </Link>
            {user.phoneVerified ? (
              <span className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-500 cursor-default select-none">
                <ShieldCheck size={15} />
                WhatsApp verificado
              </span>
            ) : (
              <Link
                href="/verify-phone"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-400 transition-colors hover:bg-yellow-500/10 hover:text-yellow-300"
              >
                <ShieldAlert size={15} />
                Verificar WhatsApp
              </Link>
            )}
          </div>

          <div className="border-t border-white/8 py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); logout(); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
