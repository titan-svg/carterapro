'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  LocationIcon,
  TagIcon,
  CarIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { getClientById, ClientStatus, Vehicle, Client } from '@/lib/data';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  status: ClientStatus;
  source: string;
  tags: string[];
  vehicles: Omit<Vehicle, 'id'>[];
  notes: string[];
}

const sourceOptions = [
  'Referido',
  'Pagina Web',
  'Redes Sociales',
  'Expo/Evento',
  'Llamada en frio',
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Otro',
];

const vehicleTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'van', label: 'Van' },
  { value: 'coupe', label: 'Coupe' },
];

const interestOptions = [
  { value: 'buy', label: 'Comprar' },
  { value: 'sell', label: 'Vender' },
  { value: 'trade', label: 'Intercambiar' },
];

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Omit<Vehicle, 'id'>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'sedan',
    interest: 'buy',
    budget: undefined,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setFormData({
          name: foundClient.name,
          email: foundClient.email,
          phone: foundClient.phone,
          company: foundClient.company || '',
          position: foundClient.position || '',
          address: foundClient.address || '',
          city: foundClient.city || '',
          status: foundClient.status,
          source: foundClient.source,
          tags: [...foundClient.tags],
          vehicles: foundClient.vehicles.map(({ id, ...rest }) => rest),
          notes: [...foundClient.notes],
        });
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

  if (!client || !formData) {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => prev ? { ...prev, tags: [...prev.tags, newTag.trim()] } : prev);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => prev ? { ...prev, tags: prev.tags.filter(t => t !== tag) } : prev);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData(prev => prev ? { ...prev, notes: [...prev.notes, newNote.trim()] } : prev);
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setFormData(prev => prev ? { ...prev, notes: prev.notes.filter((_, i) => i !== index) } : prev);
  };

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentVehicle(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'budget' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleAddVehicle = () => {
    if (currentVehicle.brand && currentVehicle.model) {
      setFormData(prev => prev ? { ...prev, vehicles: [...prev.vehicles, currentVehicle] } : prev);
      setCurrentVehicle({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'sedan',
        interest: 'buy',
        budget: undefined,
        notes: '',
      });
      setShowVehicleForm(false);
    }
  };

  const handleRemoveVehicle = (index: number) => {
    setFormData(prev => prev ? { ...prev, vehicles: prev.vehicles.filter((_, i) => i !== index) } : prev);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es valido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El telefono es requerido';
    }

    if (!formData.source) {
      newErrors.source = 'La fuente es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would send data to the API
    console.log('Updated client data:', formData);

    router.push(`/clientes/${client.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/clientes/${client.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Cliente
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-slate-900">Editar Cliente</h1>
            <p className="text-slate-500 mt-1">Modifica la informacion de {client.name}</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" />
                Informacion Basica
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Perez Garcia"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MailIcon className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <PhoneIcon className="w-4 h-4 inline mr-1" />
                    Telefono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+52 55 1234 5678"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <BuildingIcon className="w-4 h-4 inline mr-1" />
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Puesto
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Ej: Director General"
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <LocationIcon className="w-4 h-4 inline mr-1" />
                    Direccion
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle y numero"
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej: Ciudad de Mexico"
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Status and Source */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Estado y Origen</h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado del cliente
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="prospect">Prospecto</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fuente *
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.source ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <option value="">Seleccionar fuente</option>
                    {sourceOptions.map(source => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                  {errors.source && (
                    <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-indigo-600" />
                Etiquetas
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-indigo-900"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Agregar etiqueta..."
                  className="flex-1 px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
                >
                  Agregar
                </button>
              </div>
            </motion.div>

            {/* Vehicles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-indigo-600" />
                  Vehiculos de Interes
                </h2>
                <button
                  type="button"
                  onClick={() => setShowVehicleForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Agregar Vehiculo
                </button>
              </div>

              {formData.vehicles.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {formData.vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(index)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3 mb-2">
                        <CarIcon className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-slate-900">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>Ano: {vehicle.year}</p>
                        <p>Tipo: {vehicleTypes.find(t => t.value === vehicle.type)?.label}</p>
                        <p>Interes: {interestOptions.find(i => i.value === vehicle.interest)?.label}</p>
                        {vehicle.budget && <p>Presupuesto: ${vehicle.budget.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showVehicleForm && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-4">Nuevo Vehiculo</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Marca *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={currentVehicle.brand}
                        onChange={handleVehicleChange}
                        placeholder="Ej: Toyota"
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={currentVehicle.model}
                        onChange={handleVehicleChange}
                        placeholder="Ej: Camry"
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Ano
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={currentVehicle.year}
                        onChange={handleVehicleChange}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tipo
                      </label>
                      <select
                        name="type"
                        value={currentVehicle.type}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {vehicleTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Interes
                      </label>
                      <select
                        name="interest"
                        value={currentVehicle.interest}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {interestOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Presupuesto
                      </label>
                      <input
                        type="number"
                        name="budget"
                        value={currentVehicle.budget || ''}
                        onChange={handleVehicleChange}
                        placeholder="Ej: 500000"
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Notas del vehiculo
                      </label>
                      <textarea
                        name="notes"
                        value={currentVehicle.notes || ''}
                        onChange={handleVehicleChange}
                        placeholder="Detalles adicionales..."
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowVehicleForm(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddVehicle}
                      disabled={!currentVehicle.brand || !currentVehicle.model}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Agregar Vehiculo
                    </button>
                  </div>
                </div>
              )}

              {formData.vehicles.length === 0 && !showVehicleForm && (
                <p className="text-slate-500 text-center py-4">
                  No hay vehiculos de interes agregados
                </p>
              )}
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Notas</h2>

              {formData.notes.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.notes.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-slate-50 rounded-lg p-3 group"
                    >
                      <span className="flex-1 text-slate-700">{note}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(index)}
                        className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddNote())}
                  placeholder="Agregar una nota..."
                  className="flex-1 px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
                >
                  Agregar
                </button>
              </div>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={`/clientes/${client.id}`}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </main>
    </div>
  );
}
