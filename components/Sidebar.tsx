'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ChatIcon,
  CalendarIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
  PlusIcon,
  BriefcaseIcon,
  ChartIcon,
} from '@/components/Icons';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/clientes', label: 'Clientes', icon: UsersIcon },
    { href: '/interacciones', label: 'Interacciones', icon: ChatIcon },
    { href: '/seguimientos', label: 'Seguimientos', icon: CalendarIcon },
    { href: '/configuracion', label: 'Configuración', icon: SettingsIcon },
  ];

  const quickActions = [
    { href: '/clientes/nuevo', label: 'Nuevo Cliente', icon: PlusIcon },
    { href: '/interacciones/nueva', label: 'Nueva Interacción', icon: ChatIcon },
    { href: '/seguimientos/nuevo', label: 'Nuevo Seguimiento', icon: CalendarIcon },
  ];

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">CarteraPro</span>
              <p className="text-xs text-slate-500">Gestión de Ventas</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                {item.label}
              </Link>
            );
          })}

          {/* Quick Actions */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-3">
              Acciones Rápidas
            </p>
            {quickActions.map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
            <BriefcaseIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">CarteraPro</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white z-50 flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
                    <BriefcaseIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">CarteraPro</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(item => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-3">
                    Acciones Rápidas
                  </p>
                  {quickActions.map(action => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl"
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg"
                  >
                    <LogoutIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
