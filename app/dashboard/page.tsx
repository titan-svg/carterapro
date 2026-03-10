'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  UsersIcon,
  CalendarIcon,
  ChatIcon,
  PlusIcon,
  ChevronRightIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  clients,
  interactions,
  followUps,
  getDashboardStats,
  formatDate,
  formatCurrency,
  getClientById,
  getInteractionTypeLabel,
  getPriorityLabel,
  getStatusLabel,
} from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  const stats = getDashboardStats();

  // Get recent interactions with client info
  const recentInteractions = [...interactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(interaction => ({
      ...interaction,
      client: getClientById(interaction.clientId),
    }));

  // Get upcoming follow-ups (pending and not overdue)
  const upcomingFollowUps = followUps
    .filter(f => f.status === 'pending' || f.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)
    .map(followUp => ({
      ...followUp,
      client: getClientById(followUp.clientId),
    }));

  // Get recent clients
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Clientes',
      value: stats.totalClients,
      icon: UsersIcon,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Clientes Activos',
      value: stats.activeClients,
      icon: CheckIcon,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Seguimientos Pendientes',
      value: stats.pendingFollowUps,
      icon: CalendarIcon,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Interacciones del Mes',
      value: stats.thisMonthInteractions,
      icon: ChatIcon,
      color: 'bg-slate-500',
      lightColor: 'bg-slate-50',
      textColor: 'text-slate-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return PhoneIcon;
      case 'email':
        return MailIcon;
      default:
        return ChatIcon;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'prospect':
        return 'bg-indigo-100 text-indigo-700';
      case 'inactive':
        return 'bg-slate-100 text-slate-600';
      case 'lost':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        <motion.div
          className="p-4 lg:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Bienvenido, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-1">
              Este es el resumen de tu cartera de clientes
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.lightColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Acciones Rapidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/clientes/nuevo">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Nuevo Cliente</span>
                </motion.div>
              </Link>
              <Link href="/interacciones/nueva">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ChatIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Nueva Interaccion</span>
                </motion.div>
              </Link>
              <Link href="/seguimientos/nuevo">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Nuevo Seguimiento</span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Interactions */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Interacciones Recientes
                </h2>
                <Link
                  href="/interacciones"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentInteractions.length > 0 ? (
                  recentInteractions.map(interaction => {
                    const Icon = getInteractionIcon(interaction.type);
                    return (
                      <div
                        key={interaction.id}
                        className="p-4 lg:px-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                            <Icon className="w-4 h-4 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {interaction.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {interaction.client?.name || 'Cliente desconocido'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">
                                {getInteractionTypeLabel(interaction.type)}
                              </span>
                              <span className="text-xs text-slate-300">|</span>
                              <span className="text-xs text-slate-400">
                                {formatDate(interaction.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No hay interacciones recientes
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Follow-ups */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Proximos Seguimientos
                </h2>
                <Link
                  href="/seguimientos"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {upcomingFollowUps.length > 0 ? (
                  upcomingFollowUps.map(followUp => (
                    <div
                      key={followUp.id}
                      className="p-4 lg:px-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                          <ClockIcon className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 truncate">
                              {followUp.title}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(
                                followUp.priority
                              )}`}
                            >
                              {getPriorityLabel(followUp.priority)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {followUp.client?.name || 'Cliente desconocido'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs ${
                                followUp.status === 'overdue'
                                  ? 'text-red-500 font-medium'
                                  : 'text-slate-400'
                              }`}
                            >
                              {followUp.status === 'overdue' ? 'Vencido: ' : ''}
                              {formatDate(followUp.dueDate)}
                              {followUp.dueTime ? ` a las ${followUp.dueTime}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No hay seguimientos pendientes
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Clients */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2"
            >
              <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Clientes Recientes
                </h2>
                <Link
                  href="/clientes"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                        Empresa
                      </th>
                      <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                        Fuente
                      </th>
                      <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentClients.map(client => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 lg:px-6 py-4">
                          <Link
                            href={`/clientes/${client.id}`}
                            className="flex items-center gap-3"
                          >
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
                                <span className="text-indigo-600 font-medium text-sm">
                                  {client.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900 hover:text-indigo-600">
                                {client.name}
                              </p>
                              <p className="text-sm text-slate-500 sm:hidden">
                                {client.company || '-'}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">
                          {client.company || '-'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                          {client.source}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              client.status
                            )}`}
                          >
                            {getStatusLabel(client.status)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                          {formatDate(client.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
