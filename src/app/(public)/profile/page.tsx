"use client";

import { useAuth } from "@/context/AuthContext";
import { Mail, Phone, ShieldCheck, MapPin, ShoppingBag, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
      </div>
    );
  }

  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl oktava-surface p-7">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-red-600/15 blur-[60px] pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-red-600/20 border border-red-500/30 text-3xl font-black text-white [font-family:var(--font-display)]">
            {initials}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white truncate">
                {user.firstName} {user.lastName}
              </h1>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  isAdmin
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-white/10 text-zinc-300 border border-white/10"
                }`}
              >
                {isAdmin ? "Admin" : "Cliente"}
              </span>
            </div>
            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-zinc-500">{user.isActive ? "Cuenta activa" : "Cuenta inactiva"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-3xl oktava-surface divide-y divide-white/6 overflow-hidden">
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Información de contacto
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/8">
                <Mail size={15} className="text-zinc-400" />
              </span>
              <div>
                <p className="text-xs text-zinc-500">Correo electrónico</p>
                <p className="text-sm font-medium text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/8">
                <Phone size={15} className="text-zinc-400" />
              </span>
              <div>
                <p className="text-xs text-zinc-500">Teléfono</p>
                <p className="text-sm font-medium text-white">
                  {user.phone || (
                    <span className="text-zinc-500 italic">No especificado</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/8">
                <ShieldCheck size={15} className="text-zinc-400" />
              </span>
              <div>
                <p className="text-xs text-zinc-500">Rol en la plataforma</p>
                <p className="text-sm font-medium text-white capitalize">
                  {isAdmin ? "Administrador" : "Cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-3xl oktava-surface divide-y divide-white/6 overflow-hidden">
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Accesos rápidos
          </p>
        </div>

        <Link
          href="/addresses"
          className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/3 group"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/8 group-hover:border-white/15 transition-colors">
              <MapPin size={15} className="text-zinc-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Mis direcciones</p>
              <p className="text-xs text-zinc-500">Gestiona dónde te entregamos</p>
            </div>
          </div>
          <ArrowRight size={15} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </Link>

        <Link
          href="/orders"
          className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/3 group"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/8 group-hover:border-white/15 transition-colors">
              <ShoppingBag size={15} className="text-zinc-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Mis pedidos</p>
              <p className="text-xs text-zinc-500">Revisa el historial de órdenes</p>
            </div>
          </div>
          <ArrowRight size={15} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </Link>
      </div>

      {/* Danger zone */}
      <div className="rounded-3xl border border-white/6 overflow-hidden">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-red-500/5 group"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 border border-red-500/20 group-hover:border-red-500/30 transition-colors">
            <LogOut size={15} className="text-red-400" />
          </span>
          <div>
            <p className="text-sm font-medium text-red-400">Cerrar sesión</p>
            <p className="text-xs text-zinc-600">Salir de tu cuenta en este dispositivo</p>
          </div>
        </button>
      </div>
    </div>
  );
}
