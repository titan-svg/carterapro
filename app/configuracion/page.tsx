'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SettingsIcon,
  UserIcon,
  BellIcon,
  LockIcon,
  DownloadIcon,
  CheckIcon,
} from '@/components/Icons';
import { clients } from '@/lib/data';

export default function ConfiguracionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    followUpReminders: true,
    newClientNotifications: false,
    weeklyReport: true,
  });

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Save states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savedNotifications, setSavedNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  // Redirect if not authenticated
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

  if (!user) {
    return null;
  }

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setSavedProfile(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSavingProfile(false);
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 3000);
  };

  const handleNotificationsSave = async () => {
    setSavingNotifications(true);
    setSavedNotifications(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setSavingNotifications(false);
    setSavedNotifications(true);
    setTimeout(() => setSavedNotifications(false), 3000);
  };

  const handlePasswordSave = async () => {
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contrasenas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('La contrasena debe tener al menos 8 caracteres');
      return;
    }

    setSavingPassword(true);
    setSavedPassword(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSavingPassword(false);
    setSavedPassword(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSavedPassword(false), 3000);
  };

  const handleExportClients = async () => {
    setExporting(true);
    setExported(false);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate CSV content
    const headers = ['Nombre', 'Email', 'Telefono', 'Empresa', 'Estado', 'Ciudad', 'Fecha Creacion'];
    const rows = clients.map(client => [
      client.name,
      client.email,
      client.phone,
      client.company || '',
      client.status,
      client.city || '',
      client.createdAt,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Configuracion
              </h1>
            </div>
            <p className="text-slate-600">
              Administra tu perfil, notificaciones y preferencias de seguridad
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Profile Settings Section */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Perfil</h2>
                    <p className="text-sm text-slate-500">Tu informacion personal</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <Image
                      src={avatarPreview || '/placeholder-avatar.png'}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
                    />
                    <label className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  </div>
                  <div className="text-sm text-slate-500">
                    <p className="font-medium text-slate-700">Foto de perfil</p>
                    <p>JPG, PNG o GIF. Maximo 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Correo electronico
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors"
                  >
                    {savingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : savedProfile ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Guardado
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Notification Preferences Section */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BellIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Notificaciones</h2>
                    <p className="text-sm text-slate-500">Configura tus preferencias de alertas</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Toggle Switches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Alertas por correo</p>
                      <p className="text-sm text-slate-500">Recibe notificaciones importantes en tu email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.emailAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                          notifications.emailAlerts ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Recordatorios de seguimiento</p>
                      <p className="text-sm text-slate-500">Alertas para tus seguimientos pendientes</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, followUpReminders: !notifications.followUpReminders })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.followUpReminders ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                          notifications.followUpReminders ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Nuevos clientes</p>
                      <p className="text-sm text-slate-500">Notificacion cuando se agrega un cliente nuevo</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, newClientNotifications: !notifications.newClientNotifications })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.newClientNotifications ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                          notifications.newClientNotifications ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Reporte semanal</p>
                      <p className="text-sm text-slate-500">Resumen semanal de tu actividad comercial</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.weeklyReport ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                          notifications.weeklyReport ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNotificationsSave}
                    disabled={savingNotifications}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors"
                  >
                    {savingNotifications ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : savedNotifications ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Guardado
                      </>
                    ) : (
                      'Guardar preferencias'
                    )}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Security Section */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <LockIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Seguridad</h2>
                    <p className="text-sm text-slate-500">Cambia tu contrasena</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contrasena actual
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Ingresa tu contrasena actual"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nueva contrasena
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Minimo 8 caracteres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirmar contrasena
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Repite la nueva contrasena"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handlePasswordSave}
                    disabled={savingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                  >
                    {savingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Actualizando...
                      </>
                    ) : savedPassword ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Actualizado
                      </>
                    ) : (
                      'Cambiar contrasena'
                    )}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Data Export Section */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <DownloadIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Exportar datos</h2>
                    <p className="text-sm text-slate-500">Descarga tu informacion de clientes</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Exportar clientes a CSV</p>
                    <p className="text-sm text-slate-500">
                      Descarga un archivo CSV con todos tus clientes ({clients.length} registros)
                    </p>
                  </div>
                  <button
                    onClick={handleExportClients}
                    disabled={exporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-medium transition-colors whitespace-nowrap"
                  >
                    {exporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Exportando...
                      </>
                    ) : exported ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Descargado
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="w-5 h-5" />
                        Descargar CSV
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
