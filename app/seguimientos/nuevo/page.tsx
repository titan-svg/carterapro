'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  UserIcon,
  CheckIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import {
  clients,
  FollowUpPriority,
  getPriorityLabel,
} from '@/lib/data';

interface FormData {
  clientId: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: FollowUpPriority;
  reminder: boolean;
}

interface FormErrors {
  clientId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
}

export default function NuevoSeguimientoPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clientId: '',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    reminder: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Selecciona un cliente';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'El titulo es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripcion es requerida';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
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

    setShowSuccess(true);
    setTimeout(() => {
      router.push('/seguimientos');
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const priorityOptions: { value: FollowUpPriority; label: string; color: string }[] = [
    { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-700 border-green-200' },
  ];

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
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/seguimientos"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver a seguimientos
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Nuevo Seguimiento</h1>
            <p className="text-slate-600 mt-1">Programa un recordatorio para dar seguimiento a un cliente</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">Seguimiento creado exitosamente</h3>
                <p className="text-sm text-emerald-600">Redirigiendo a la lista de seguimientos...</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Client Selector */}
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Cliente *
                  </span>
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.clientId ? 'border-red-300 bg-red-50' : 'border-slate-200'
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
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Titulo del seguimiento *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Llamar para confirmar reunion"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Descripcion *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe que necesitas hacer en este seguimiento..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Fecha de vencimiento *
                    </span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.dueDate ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                  {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                </div>

                <div>
                  <label htmlFor="dueTime" className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Hora (opcional)
                    </span>
                  </label>
                  <input
                    type="time"
                    id="dueTime"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Prioridad</label>
                <div className="flex flex-wrap gap-3">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                      className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${
                        formData.priority === option.value
                          ? `${option.color} border-current`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <BellIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Activar recordatorio</p>
                    <p className="text-sm text-slate-500">Recibir notificacion antes de la fecha limite</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="reminder"
                    checked={formData.reminder}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link
                href="/seguimientos"
                className="px-6 py-3 text-center bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Crear Seguimiento
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
