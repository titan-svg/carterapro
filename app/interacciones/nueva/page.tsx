'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ChatIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  UsersIcon,
  ArrowLeftIcon,
  CheckIcon,
  LocationIcon,
} from '@/components/Icons';
import {
  clients,
  InteractionType,
  getInteractionTypeLabel,
} from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

const interactionTypes: { value: InteractionType; label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }[] = [
  {
    value: 'call',
    label: 'Llamada',
    icon: PhoneIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 border-emerald-200 hover:bg-emerald-200'
  },
  {
    value: 'meeting',
    label: 'Reunion',
    icon: UsersIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 border-indigo-200 hover:bg-indigo-200'
  },
  {
    value: 'email',
    label: 'Email',
    icon: MailIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 border-amber-200 hover:bg-amber-200'
  },
  {
    value: 'message',
    label: 'Mensaje',
    icon: ChatIcon,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100 border-sky-200 hover:bg-sky-200'
  },
  {
    value: 'visit',
    label: 'Visita',
    icon: LocationIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 border-purple-200 hover:bg-purple-200'
  },
];

const outcomeOptions = [
  'Interesado',
  'Muy interesado',
  'Pendiente respuesta',
  'Sin interes',
  'Necesita mas informacion',
  'Agendar seguimiento',
  'Venta cerrada',
  'Otro',
];

export default function NuevaInteraccionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    clientId: '',
    type: '' as InteractionType | '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    outcome: '',
    customOutcome: '',
    nextSteps: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Selecciona un cliente';
    }
    if (!formData.type) {
      newErrors.type = 'Selecciona el tipo de interaccion';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Ingresa un titulo para la interaccion';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Describe la interaccion';
    }
    if (!formData.date) {
      newErrors.date = 'Selecciona la fecha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitSuccess(true);

    // Redirect after success
    setTimeout(() => {
      router.push('/interacciones');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);

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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
          <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[80vh]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Interaccion registrada
              </h2>
              <p className="text-slate-600">
                La interaccion ha sido guardada exitosamente.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/interacciones"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver a interacciones
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Nueva Interaccion</h1>
            <p className="text-slate-600 mt-1">
              Registra un nuevo contacto con un cliente
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              {/* Client Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700 ${
                    errors.clientId ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `- ${client.company}` : ''}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
                )}
                {selectedClient && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <PhoneIcon className="w-4 h-4" />
                    {selectedClient.phone}
                    <span className="mx-2">|</span>
                    <MailIcon className="w-4 h-4" />
                    {selectedClient.email}
                  </div>
                )}
              </div>

              {/* Interaction Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de interaccion <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {interactionTypes.map(type => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          isSelected
                            ? `${type.bgColor} border-2`
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? type.color : 'text-slate-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? type.color : 'text-slate-600'}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.type && (
                  <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titulo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ej. Llamada de seguimiento, Reunion en oficina..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Date and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.date ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duracion (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="ej. 30"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripcion <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe los detalles de la interaccion..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Outcome */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resultado
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {outcomeOptions.map(outcome => (
                    <button
                      key={outcome}
                      type="button"
                      onClick={() => handleInputChange('outcome', outcome === formData.outcome ? '' : outcome)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        formData.outcome === outcome
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {outcome}
                    </button>
                  ))}
                </div>
                {formData.outcome === 'Otro' && (
                  <input
                    type="text"
                    value={formData.customOutcome}
                    onChange={(e) => handleInputChange('customOutcome', e.target.value)}
                    placeholder="Especifica el resultado..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proximos pasos
                </label>
                <textarea
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  placeholder="Que acciones se deben tomar despues de esta interaccion..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      Guardar Interaccion
                    </>
                  )}
                </button>
                <Link
                  href="/interacciones"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
