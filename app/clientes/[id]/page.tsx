'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  PhoneIcon,
  MailIcon,
  CarIcon,
  LocationIcon,
  CalendarIcon,
  PlusIcon,
  ChatIcon,
  NoteIcon,
  TagIcon,
  BuildingIcon,
  ClockIcon,
  XIcon,
  CheckIcon,
  StarIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import {
  getClientById,
  getClientInteractions,
  Client,
  ClientStatus,
  Interaction,
  getStatusLabel,
  formatDate,
  formatDateTime,
  formatCurrency,
  getVehicleTypeLabel,
  getVehicleInterestLabel,
  getInteractionTypeLabel,
} from '@/lib/data';

const statusColors: Record<ClientStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  prospect: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  lost: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

const interactionIcons: Record<string, typeof PhoneIcon> = {
  call: PhoneIcon,
  meeting: CalendarIcon,
  email: MailIcon,
  message: ChatIcon,
  visit: LocationIcon,
};

const interestColors: Record<string, { bg: string; text: string }> = {
  buy: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  sell: { bg: 'bg-amber-100', text: 'text-amber-700' },
  trade: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export default function ClienteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'notes' | 'interactions'>('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [clientNotes, setClientNotes] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (params.id) {
      const foundClient = getClientById(params.id as string);
      if (foundClient) {
        setClient(foundClient);
        setClientNotes(foundClient.notes);
        setInteractions(getClientInteractions(foundClient.id));
      }
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!client) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Cliente no encontrado</h2>
              <p className="text-slate-500 mb-6">El cliente que buscas no existe o fue eliminado.</p>
              <Link
                href="/clientes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Volver a Clientes
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setClientNotes([newNote, ...clientNotes]);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = (index: number) => {
    setClientNotes(clientNotes.filter((_, i) => i !== index));
  };

  const handleDeleteClient = () => {
    // In a real app, this would call an API
    router.push('/clientes');
  };

  const tabs = [
    { id: 'info', label: 'Informacion' },
    { id: 'vehicles', label: `Vehiculos (${client.vehicles.length})` },
    { id: 'notes', label: `Notas (${clientNotes.length})` },
    { id: 'interactions', label: `Interacciones (${interactions.length})` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver a Clientes
          </Link>

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {client.avatar ? (
                  <Image
                    src={client.avatar}
                    alt={client.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                    {client.company && (
                      <p className="text-slate-500 flex items-center gap-2 mt-1">
                        <BuildingIcon className="w-4 h-4" />
                        {client.company}
                        {client.position && <span>- {client.position}</span>}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        statusColors[client.status].bg
                      } ${statusColors[client.status].text}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusColors[client.status].dot}`} />
                      {getStatusLabel(client.status)}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 flex flex-wrap gap-4">
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <MailIcon className="w-4 h-4" />
                    {client.email}
                  </a>
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {client.phone}
                  </a>
                  {client.city && (
                    <span className="flex items-center gap-2 text-slate-600">
                      <LocationIcon className="w-4 h-4" />
                      {client.city}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {client.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {client.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/clientes/${client.id}/editar`}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  <EditIcon className="w-4 h-4" />
                  Editar
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Cliente desde: {formatDate(client.createdAt)}
              </span>
              {client.lastContact && (
                <span className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Ultimo contacto: {formatDate(client.lastContact)}
                </span>
              )}
              <span className="flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Fuente: {client.source}
              </span>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-indigo-600'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Info Tab */}
              {activeTab === 'info' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Informacion de Contacto
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="text-slate-900">{client.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Telefono</p>
                        <p className="text-slate-900">{client.phone}</p>
                      </div>
                      {client.address && (
                        <div>
                          <p className="text-sm text-slate-500">Direccion</p>
                          <p className="text-slate-900">{client.address}</p>
                        </div>
                      )}
                      {client.city && (
                        <div>
                          <p className="text-sm text-slate-500">Ciudad</p>
                          <p className="text-slate-900">{client.city}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Informacion Comercial
                    </h3>
                    <div className="space-y-4">
                      {client.company && (
                        <div>
                          <p className="text-sm text-slate-500">Empresa</p>
                          <p className="text-slate-900">{client.company}</p>
                        </div>
                      )}
                      {client.position && (
                        <div>
                          <p className="text-sm text-slate-500">Puesto</p>
                          <p className="text-slate-900">{client.position}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-slate-500">Fuente</p>
                        <p className="text-slate-900">{client.source}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Estado</p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                            statusColors[client.status].bg
                          } ${statusColors[client.status].text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[client.status].dot}`} />
                          {getStatusLabel(client.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Vehicles Tab */}
              {activeTab === 'vehicles' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {client.vehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <CarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Sin vehiculos registrados
                      </h3>
                      <p className="text-slate-500">
                        Este cliente no tiene vehiculos de interes registrados.
                      </p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {client.vehicles.map(vehicle => (
                        <div
                          key={vehicle.id}
                          className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <CarIcon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {vehicle.brand} {vehicle.model}
                                </h4>
                                <p className="text-sm text-slate-500">{vehicle.year}</p>
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                interestColors[vehicle.interest].bg
                              } ${interestColors[vehicle.interest].text}`}
                            >
                              {getVehicleInterestLabel(vehicle.interest)}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Tipo</span>
                              <span className="text-slate-900">{getVehicleTypeLabel(vehicle.type)}</span>
                            </div>
                            {vehicle.budget && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Presupuesto</span>
                                <span className="text-slate-900 font-medium">
                                  {formatCurrency(vehicle.budget)}
                                </span>
                              </div>
                            )}
                          </div>
                          {vehicle.notes && (
                            <p className="mt-4 text-sm text-slate-600 bg-white p-3 rounded-lg">
                              {vehicle.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Notas del cliente</h3>
                    <button
                      onClick={() => setShowAddNote(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Agregar Nota
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddNote && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <textarea
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            placeholder="Escribe una nota..."
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => {
                                setShowAddNote(false);
                                setNewNote('');
                              }}
                              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Guardar Nota
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {clientNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <NoteIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Sin notas</h3>
                      <p className="text-slate-500">No hay notas registradas para este cliente.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientNotes.map((note, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-slate-50 rounded-xl p-4 border border-slate-200 group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <NoteIcon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                              <p className="text-slate-700">{note}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteNote(index)}
                              className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Interactions Tab */}
              {activeTab === 'interactions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Historial de interacciones</h3>
                    <Link
                      href="/interacciones/nueva"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Nueva Interaccion
                    </Link>
                  </div>

                  {interactions.length === 0 ? (
                    <div className="text-center py-12">
                      <ChatIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Sin interacciones
                      </h3>
                      <p className="text-slate-500">
                        No hay interacciones registradas con este cliente.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
                      <div className="space-y-6">
                        {interactions.map((interaction, index) => {
                          const Icon = interactionIcons[interaction.type] || ChatIcon;
                          return (
                            <motion.div
                              key={interaction.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-12"
                            >
                              <div className="absolute left-0 w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                        {getInteractionTypeLabel(interaction.type)}
                                      </span>
                                      <span className="text-sm text-slate-500">
                                        {formatDateTime(interaction.createdAt)}
                                      </span>
                                    </div>
                                    <h4 className="font-semibold text-slate-900">{interaction.title}</h4>
                                    <p className="text-slate-600 mt-1">{interaction.description}</p>
                                    {interaction.outcome && (
                                      <p className="text-sm text-slate-500 mt-2">
                                        <span className="font-medium">Resultado:</span> {interaction.outcome}
                                      </p>
                                    )}
                                    {interaction.nextSteps && (
                                      <p className="text-sm text-emerald-600 mt-1">
                                        <span className="font-medium">Siguientes pasos:</span>{' '}
                                        {interaction.nextSteps}
                                      </p>
                                    )}
                                  </div>
                                  {interaction.duration && (
                                    <span className="text-sm text-slate-500 flex items-center gap-1 flex-shrink-0">
                                      <ClockIcon className="w-4 h-4" />
                                      {interaction.duration} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Eliminar Cliente</h3>
                <p className="text-slate-500 mb-6">
                  Estas seguro de que quieres eliminar a <span className="font-medium">{client.name}</span>?
                  Esta accion no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteClient}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
