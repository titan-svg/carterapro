'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  BellIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import {
  followUps,
  clients,
  FollowUp,
  FollowUpStatus,
  FollowUpPriority,
  getClientById,
  formatDate,
  getFollowUpStatusLabel,
  getPriorityLabel,
} from '@/lib/data';

type TabType = 'all' | 'pending' | 'completed' | 'overdue';
type ViewType = 'list' | 'calendar';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  followUps: FollowUp[];
}

export default function SeguimientosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<FollowUpPriority | 'all'>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localFollowUps, setLocalFollowUps] = useState<FollowUp[]>(followUps);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const tabs: { id: TabType; label: string; count: number }[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [
      { id: 'all', label: 'Todos', count: localFollowUps.length },
      { id: 'pending', label: 'Pendientes', count: localFollowUps.filter(f => f.status === 'pending').length },
      { id: 'completed', label: 'Completados', count: localFollowUps.filter(f => f.status === 'completed').length },
      {
        id: 'overdue',
        label: 'Vencidos',
        count: localFollowUps.filter(f => {
          const dueDate = new Date(f.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return (f.status === 'pending' && dueDate < today) || f.status === 'overdue';
        }).length,
      },
    ];
  }, [localFollowUps]);

  const filteredFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return localFollowUps.filter(followUp => {
      // Tab filter
      if (activeTab === 'pending' && followUp.status !== 'pending') return false;
      if (activeTab === 'completed' && followUp.status !== 'completed') return false;
      if (activeTab === 'overdue') {
        const dueDate = new Date(followUp.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (followUp.status !== 'overdue' && !(followUp.status === 'pending' && dueDate < today)) return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && followUp.priority !== selectedPriority) return false;

      // Search filter
      if (searchQuery) {
        const client = getClientById(followUp.clientId);
        const searchLower = searchQuery.toLowerCase();
        const matchesTitle = followUp.title.toLowerCase().includes(searchLower);
        const matchesDescription = followUp.description.toLowerCase().includes(searchLower);
        const matchesClient = client?.name.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription && !matchesClient) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [localFollowUps, activeTab, selectedPriority, searchQuery]);

  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        followUps: localFollowUps.filter(f => f.dueDate === dateStr),
      });
    }

    return days;
  }, [currentMonth, localFollowUps]);

  const handleMarkComplete = (followUpId: string) => {
    setLocalFollowUps(prev =>
      prev.map(f =>
        f.id === followUpId
          ? { ...f, status: 'completed' as FollowUpStatus, completedAt: new Date().toISOString() }
          : f
      )
    );
  };

  const getPriorityBadgeClasses = (priority: FollowUpPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
    }
  };

  const getStatusBadgeClasses = (status: FollowUpStatus, dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'cancelled') return 'bg-slate-100 text-slate-700';
    if (status === 'overdue' || (status === 'pending' && due < today)) return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const isOverdue = (status: FollowUpStatus, dueDate: string) => {
    if (status === 'overdue') return true;
    if (status !== 'pending') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const getDisplayStatus = (status: FollowUpStatus, dueDate: string): string => {
    if (isOverdue(status, dueDate)) return 'Vencido';
    return getFollowUpStatusLabel(status);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Seguimientos</h1>
              <p className="text-slate-600 mt-1">Gestiona tus recordatorios y tareas pendientes</p>
            </div>
            <Link
              href="/seguimientos/nuevo"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Seguimiento
            </Link>
          </div>

          {/* View Toggle & Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewType('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewType === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FilterIcon className="w-4 h-4" />
                  Lista
                </button>
                <button
                  onClick={() => setViewType('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewType === 'calendar'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Calendario
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar seguimientos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value as FollowUpPriority | 'all')}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          {viewType === 'list' && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* List View */}
          {viewType === 'list' && (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredFollowUps.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center"
                  >
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay seguimientos</h3>
                    <p className="text-slate-600 mb-4">
                      {searchQuery
                        ? 'No se encontraron seguimientos con ese criterio de busqueda'
                        : 'Comienza creando tu primer seguimiento'}
                    </p>
                    <Link
                      href="/seguimientos/nuevo"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Crear seguimiento
                    </Link>
                  </motion.div>
                ) : (
                  filteredFollowUps.map((followUp, index) => {
                    const client = getClientById(followUp.clientId);
                    const overdue = isOverdue(followUp.status, followUp.dueDate);

                    return (
                      <motion.div
                        key={followUp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow ${
                          overdue ? 'border-l-4 border-l-red-500' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">{followUp.title}</h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClasses(
                                  followUp.priority
                                )}`}
                              >
                                {getPriorityLabel(followUp.priority)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                  followUp.status,
                                  followUp.dueDate
                                )}`}
                              >
                                {getDisplayStatus(followUp.status, followUp.dueDate)}
                              </span>
                            </div>

                            <p className="text-slate-600 mb-3 line-clamp-2">{followUp.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              {client && (
                                <Link
                                  href={`/clientes/${client.id}`}
                                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                                >
                                  <UserIcon className="w-4 h-4" />
                                  {client.name}
                                </Link>
                              )}
                              <div
                                className={`flex items-center gap-1.5 ${
                                  overdue ? 'text-red-600 font-medium' : ''
                                }`}
                              >
                                <CalendarIcon className="w-4 h-4" />
                                {formatDate(followUp.dueDate)}
                              </div>
                              {followUp.dueTime && (
                                <div className="flex items-center gap-1.5">
                                  <ClockIcon className="w-4 h-4" />
                                  {followUp.dueTime}
                                </div>
                              )}
                              {followUp.reminder && (
                                <div className="flex items-center gap-1.5 text-indigo-600">
                                  <BellIcon className="w-4 h-4" />
                                  Recordatorio activo
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center gap-2">
                            {followUp.status === 'pending' && (
                              <button
                                onClick={() => handleMarkComplete(followUp.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium transition-colors"
                              >
                                <CheckIcon className="w-4 h-4" />
                                <span className="sm:hidden lg:inline">Completar</span>
                              </button>
                            )}
                            <Link
                              href={`/clientes/${followUp.clientId}`}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                            >
                              <ChevronRightIcon className="w-4 h-4" />
                              <span className="sm:hidden lg:inline">Ver cliente</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Calendar View */}
          {viewType === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900">
                  {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Day Headers */}
                {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-slate-500 border-b border-slate-200 bg-slate-50"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border-b border-r border-slate-100 ${
                      !day.isCurrentMonth ? 'bg-slate-50' : ''
                    } ${day.isToday ? 'bg-indigo-50' : ''}`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        !day.isCurrentMonth
                          ? 'text-slate-400'
                          : day.isToday
                          ? 'text-indigo-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.followUps.slice(0, 2).map(followUp => (
                        <div
                          key={followUp.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                            followUp.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : followUp.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                          title={followUp.title}
                        >
                          {followUp.title}
                        </div>
                      ))}
                      {day.followUps.length > 2 && (
                        <div className="text-xs text-slate-500 pl-1">
                          +{day.followUps.length - 2} mas
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
