'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  UsersIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  PhoneIcon,
  MailIcon,
  ChevronRightIcon,
  TableIcon,
  TagIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { clients, Client, ClientStatus, getStatusLabel, formatDate } from '@/lib/data';

type ViewMode = 'grid' | 'list';

const statusColors: Record<ClientStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  prospect: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  lost: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function ClientesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    prospect: clients.filter(c => c.status === 'prospect').length,
    lost: clients.filter(c => c.status === 'lost').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
              <p className="text-slate-500 mt-1">
                {filteredClients.length} de {clients.length} clientes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/clientes/importar"
                className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Importar
              </Link>
              <Link
                href="/clientes/nuevo"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Cliente
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, telefono o empresa..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                  showFilters || statusFilter !== 'all'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FilterIcon className="w-5 h-5" />
                <span className="font-medium">Filtros</span>
                {statusFilter !== 'all' && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
                )}
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Vista de cuadricula"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Vista de lista"
                >
                  <TableIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <p className="text-sm font-medium text-slate-700 mb-3">Estado del cliente</p>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'active', 'prospect', 'inactive', 'lost'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            statusFilter === status
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {status === 'all' ? 'Todos' : getStatusLabel(status)} ({statusCounts[status]})
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clients Grid/List */}
          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron clientes</h3>
              <p className="text-slate-500 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de busqueda'
                  : 'Comienza agregando tu primer cliente'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  href="/clientes/nuevo"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  <PlusIcon className="w-5 h-5" />
                  Agregar Cliente
                </Link>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/clientes/${client.id}`}>
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group">
                        <div className="flex items-start gap-4">
                          {client.avatar ? (
                            <Image
                              src={client.avatar}
                              alt={client.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-lg">
                                {client.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                              {client.name}
                            </h3>
                            {client.company && (
                              <p className="text-sm text-slate-500 truncate">{client.company}</p>
                            )}
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MailIcon className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <PhoneIcon className="w-4 h-4 text-slate-400" />
                            <span>{client.phone}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              statusColors[client.status].bg
                            } ${statusColors[client.status].text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[client.status].dot}`} />
                            {getStatusLabel(client.status)}
                          </span>
                          {client.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <TagIcon className="w-4 h-4 text-slate-400" />
                              <span className="text-xs text-slate-500">{client.tags.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Ultimo Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Etiquetas
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map(client => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/clientes/${client.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {client.avatar ? (
                              <Image
                                src={client.avatar}
                                alt={client.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                  {client.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{client.name}</p>
                              {client.company && (
                                <p className="text-sm text-slate-500">{client.company}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-900">{client.email}</p>
                            <p className="text-sm text-slate-500">{client.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              statusColors[client.status].bg
                            } ${statusColors[client.status].text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[client.status].dot}`} />
                            {getStatusLabel(client.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {client.lastContact ? formatDate(client.lastContact) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {client.tags.length > 2 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                +{client.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ChevronRightIcon className="w-5 h-5 text-slate-300" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
