'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  ChartIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from '@/components/Icons';

const features = [
  {
    icon: UsersIcon,
    title: 'Gestión de Clientes',
    description: 'Organiza tu cartera de clientes con información detallada, vehículos de interés y notas comerciales.',
  },
  {
    icon: ChatIcon,
    title: 'Historial de Interacciones',
    description: 'Registra llamadas, reuniones, correos y mensajes. Mantén un seguimiento completo de cada contacto.',
  },
  {
    icon: CalendarIcon,
    title: 'Seguimientos Inteligentes',
    description: 'Programa recordatorios y no pierdas ninguna oportunidad de venta con alertas automáticas.',
  },
  {
    icon: ChartIcon,
    title: 'Dashboard Ejecutivo',
    description: 'Visualiza métricas clave, actividad reciente y pendientes en un panel centralizado.',
  },
];

const benefits = [
  'Aumenta tu productividad comercial',
  'Nunca olvides un seguimiento importante',
  'Centraliza toda la información de tus clientes',
  'Accede desde cualquier dispositivo',
  'Importa clientes desde Excel o CSV',
  'Interfaz intuitiva y moderna',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CarteraPro</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
            >
              Gestiona tu cartera de ventas{' '}
              <span className="text-indigo-600">como un profesional</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg sm:text-xl text-slate-600"
            >
              CarteraPro te ayuda a organizar clientes, registrar interacciones y programar seguimientos.
              Todo lo que necesitas para cerrar más ventas en un solo lugar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/registro"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Comenzar Gratis
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver Demo
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <ChartIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-100 rounded mt-2" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-indigo-600 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
                      <div className="h-6 w-12 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full" />
                        <div className="flex-1">
                          <div className="h-3 w-24 bg-slate-200 rounded" />
                          <div className="h-2 w-16 bg-slate-100 rounded mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-indigo-200 rounded" />
                        <div className="flex-1">
                          <div className="h-3 w-full bg-slate-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Todo lo que necesitas para vender más
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para ejecutivos de ventas que quieren maximizar su productividad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Potencia tu gestión comercial
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                CarteraPro está diseñado para ejecutivos de ventas que manejan su propia cartera de clientes
                y necesitan una herramienta simple pero poderosa.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">+35%</div>
                <p className="text-indigo-200 mb-6">Aumento promedio en productividad</p>
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold">2.5x</div>
                    <p className="text-sm text-indigo-200">Más seguimientos completados</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold">40%</div>
                    <p className="text-sm text-indigo-200">Menos tiempo en admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Comienza a gestionar tu cartera hoy
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Únete a miles de ejecutivos de ventas que ya confían en CarteraPro para cerrar más negocios.
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Crear Cuenta Gratis
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">CarteraPro</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 CarteraPro. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
