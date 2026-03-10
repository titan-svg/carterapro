'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ChatIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  UsersIcon,
  SearchIcon,
  PlusIcon,
  FilterIcon,
  XIcon,
  LocationIcon,
} from '@/components/Icons';
import {
  interactions,
  clients,
  Interaction,
  InteractionType,
  getClientById,
  formatDate,
  getInteractionTypeLabel,
} from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

const interactionTypes: { value: InteractionType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'call', label: 'Llamadas' },
  { value: 'meeting', label: 'Reuniones' },
  { value: 'email', label: 'Emails' },
  { value: 'message', label: 'Mensajes' },
  { value: 'visit', label: 'Visitas' },
];

function getInteractionIcon(type: InteractionType) {
  switch (type) {
    case 'call':
      return PhoneIcon;
    case 'meeting':
      return UsersIcon;
    case 'email':
      return MailIcon;
    case 'message':
      return ChatIcon;
    case 'visit':
      return LocationIcon;
    default:
      return ChatIcon;
  }
}

function getInteractionTypeColor(type: InteractionType) {
  switch (type) {
    case 'call':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'meeting':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'email':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'message':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'visit':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function getInteractionIconBgColor(type: InteractionType) {
  switch (type) {
    case 'call':
      return 'bg-emerald-500';
    case 'meeting':
      return 'bg-indigo-500';
    case 'email':
      return 'bg-amber-500';
    case 'message':
      return 'bg-sky-500';
    case 'visit':
      return 'bg-purple-500';
    default:
      return 'bg-slate-500';
  }
}

export default function InteraccionesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<InteractionType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const filteredInteractions = useMemo(() => {
    let result = [...interactions];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(i => i.type === typeFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter(i => {
        const interactionDate = new Date(i.date);

        switch (dateFilter) {
          case 'today':
            return interactionDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return interactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return interactionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(i => {
        const client = getClientById(i.clientId);
        return (
          i.title.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.outcome?.toLowerCase().includes(query) ||
          client?.name.toLowerCase().includes(query)
        );
      });
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [searchQuery, typeFilter, dateFilter]);

  const clearFilters = () => {
    setTypeFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = typeFilter !== 'all' || dateFilter !== 'all' || searchQuery.trim() !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Interacciones</h1>
              <p className="text-slate-600 mt-1">
                Historial de contactos con tus clientes
              </p>
            </div>
            <Link
              href="/interacciones/nueva"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nueva Interaccion
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar interacciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                <FilterIcon className="w-5 h-5" />
                Filtros
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                )}
              </button>

              {/* Desktop Filters */}
              <div className="hidden sm:flex items-center gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as InteractionType | 'all')}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700"
                >
                  {interactionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700"
                >
                  <option value="all">Todas las fechas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Ultima semana</option>
                  <option value="month">Ultimo mes</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2.5 text-slate-600 hover:text-slate-900 text-sm"
                  >
                    <XIcon className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="sm:hidden overflow-hidden"
                >
                  <div className="pt-4 space-y-3 border-t border-slate-100 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tipo de interaccion
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as InteractionType | 'all')}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700"
                      >
                        {interactionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fecha
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700"
                      >
                        <option value="all">Todas las fechas</option>
                        <option value="today">Hoy</option>
                        <option value="week">Ultima semana</option>
                        <option value="month">Ultimo mes</option>
                      </select>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                      >
                        <XIcon className="w-4 h-4" />
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            {interactionTypes.slice(1).map(type => {
              const count = interactions.filter(i => i.type === type.value).length;
              const Icon = getInteractionIcon(type.value as InteractionType);
              return (
                <motion.button
                  key={type.value}
                  onClick={() => setTypeFilter(typeFilter === type.value ? 'all' : type.value as InteractionType)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-xl p-4 border transition-colors ${
                    typeFilter === type.value
                      ? 'border-indigo-300 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${getInteractionIconBgColor(type.value as InteractionType)} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-sm text-slate-600">{type.label}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Interactions List */}
          <div className="space-y-4">
            {filteredInteractions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No se encontraron interacciones
                </h3>
                <p className="text-slate-600 mb-6">
                  {hasActiveFilters
                    ? 'Intenta ajustar los filtros de busqueda'
                    : 'Comienza registrando tu primera interaccion con un cliente'}
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <XIcon className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                ) : (
                  <Link
                    href="/interacciones/nueva"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Nueva Interaccion
                  </Link>
                )}
              </div>
            ) : (
              filteredInteractions.map((interaction, index) => {
                const client = getClientById(interaction.clientId);
                const Icon = getInteractionIcon(interaction.type);

                return (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${getInteractionIconBgColor(interaction.type)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {interaction.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getInteractionTypeColor(interaction.type)} w-fit`}>
                            <Icon className="w-4 h-4" />
                            {getInteractionTypeLabel(interaction.type)}
                          </span>
                        </div>

                        {/* Client */}
                        {client && (
                          <Link
                            href={`/clientes/${client.id}`}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm mb-2"
                          >
                            <UsersIcon className="w-4 h-4" />
                            {client.name}
                          </Link>
                        )}

                        {/* Description */}
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {interaction.description}
                        </p>

                        {/* Outcome */}
                        {interaction.outcome && (
                          <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
                            <span className="text-xs font-medium text-slate-500 uppercase">Resultado:</span>
                            <p className="text-sm text-slate-700">{interaction.outcome}</p>
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(interaction.date)}
                          </span>
                          {interaction.duration && (
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {interaction.duration} min
                            </span>
                          )}
                        </div>

                        {/* Next Steps */}
                        {interaction.nextSteps && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <span className="text-xs font-medium text-slate-500 uppercase">Proximos pasos:</span>
                            <p className="text-sm text-slate-700">{interaction.nextSteps}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Results Count */}
          {filteredInteractions.length > 0 && (
            <div className="mt-6 text-center text-sm text-slate-500">
              Mostrando {filteredInteractions.length} de {interactions.length} interacciones
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
