// Mock data for CarteraPro - Sales Portfolio Management

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'lost';
export type InteractionType = 'call' | 'meeting' | 'email' | 'message' | 'visit';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled' | 'overdue';
export type FollowUpPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  company: string;
  role: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'van' | 'coupe';
  interest: 'buy' | 'sell' | 'trade';
  budget?: number;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  status: ClientStatus;
  source: string;
  vehicles: Vehicle[];
  notes: string[];
  tags: string[];
  createdAt: string;
  lastContact?: string;
  avatar?: string;
}

export interface Interaction {
  id: string;
  clientId: string;
  type: InteractionType;
  title: string;
  description: string;
  date: string;
  duration?: number; // minutes
  outcome?: string;
  nextSteps?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  reminder: boolean;
  createdAt: string;
  completedAt?: string;
}

// Mock Current User
export const currentUser: User = {
  id: 'u1',
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@empresa.com',
  phone: '+52 55 1234 5678',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  company: 'AutoVentas Premium',
  role: 'Ejecutivo de Ventas Senior',
  createdAt: '2023-01-15',
};

// Mock Clients
export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Roberto García López',
    email: 'roberto.garcia@gmail.com',
    phone: '+52 55 9876 5432',
    company: 'Constructora García',
    position: 'Director General',
    address: 'Av. Insurgentes Sur 1234',
    city: 'Ciudad de México',
    status: 'active',
    source: 'Referido',
    vehicles: [
      { id: 'v1', brand: 'Toyota', model: 'Hilux', year: 2024, type: 'pickup', interest: 'buy', budget: 650000 },
      { id: 'v2', brand: 'Ford', model: 'Explorer', year: 2023, type: 'suv', interest: 'trade' },
    ],
    notes: [
      'Interesado en flotilla para su empresa',
      'Prefiere financiamiento a 48 meses',
      'Contactar después de las 6pm',
    ],
    tags: ['VIP', 'Flotilla', 'Financiamiento'],
    createdAt: '2024-01-10',
    lastContact: '2024-03-08',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'c2',
    name: 'María Fernanda Ruiz',
    email: 'mf.ruiz@outlook.com',
    phone: '+52 55 5555 1234',
    company: 'Despacho Ruiz & Asociados',
    position: 'Socia Fundadora',
    address: 'Polanco 567',
    city: 'Ciudad de México',
    status: 'active',
    source: 'Página Web',
    vehicles: [
      { id: 'v3', brand: 'BMW', model: 'X5', year: 2024, type: 'suv', interest: 'buy', budget: 1200000 },
    ],
    notes: [
      'Busca SUV de lujo para uso personal',
      'Importante el servicio post-venta',
    ],
    tags: ['Premium', 'SUV'],
    createdAt: '2024-02-15',
    lastContact: '2024-03-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'c3',
    name: 'Juan Carlos Hernández',
    email: 'jc.hernandez@empresa.mx',
    phone: '+52 33 4444 5555',
    company: 'Distribuidora del Norte',
    position: 'Gerente de Operaciones',
    address: 'Av. Vallarta 890',
    city: 'Guadalajara',
    status: 'prospect',
    source: 'Expo Automotriz',
    vehicles: [
      { id: 'v4', brand: 'Nissan', model: 'NP300', year: 2024, type: 'pickup', interest: 'buy', budget: 450000 },
    ],
    notes: [
      'Conocido en la expo, muy interesado',
      'Necesita cotización formal',
    ],
    tags: ['Expo', 'Pickup'],
    createdAt: '2024-03-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'c4',
    name: 'Ana Patricia Morales',
    email: 'ana.morales@yahoo.com',
    phone: '+52 55 6666 7777',
    address: 'Col. Roma Norte 234',
    city: 'Ciudad de México',
    status: 'active',
    source: 'Instagram',
    vehicles: [
      { id: 'v5', brand: 'Mazda', model: 'CX-5', year: 2024, type: 'suv', interest: 'buy', budget: 550000 },
    ],
    notes: [
      'Primera vez comprando auto nuevo',
      'Le interesa el color rojo',
    ],
    tags: ['Primera compra', 'SUV'],
    createdAt: '2024-02-20',
    lastContact: '2024-03-07',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'c5',
    name: 'Fernando Sánchez',
    email: 'f.sanchez@hotmail.com',
    phone: '+52 81 8888 9999',
    company: 'Grupo Sánchez',
    position: 'CEO',
    address: 'San Pedro Garza García',
    city: 'Monterrey',
    status: 'inactive',
    source: 'LinkedIn',
    vehicles: [
      { id: 'v6', brand: 'Mercedes-Benz', model: 'GLE', year: 2023, type: 'suv', interest: 'sell' },
    ],
    notes: [
      'Quiere vender su auto actual',
      'No responde llamadas desde febrero',
    ],
    tags: ['Venta', 'Premium'],
    createdAt: '2024-01-05',
    lastContact: '2024-02-10',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'c6',
    name: 'Laura Jiménez Torres',
    email: 'laura.jimenez@gmail.com',
    phone: '+52 55 1111 2222',
    company: 'Consultora LJT',
    position: 'Directora',
    address: 'Santa Fe 456',
    city: 'Ciudad de México',
    status: 'active',
    source: 'Referido',
    vehicles: [
      { id: 'v7', brand: 'Audi', model: 'Q7', year: 2024, type: 'suv', interest: 'buy', budget: 1500000 },
    ],
    notes: [
      'Referida por Roberto García',
      'Busca auto familiar premium',
      'Tiene prisa, quiere cerrar este mes',
    ],
    tags: ['VIP', 'Referido', 'Urgente'],
    createdAt: '2024-03-05',
    lastContact: '2024-03-09',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
];

// Mock Interactions
export const interactions: Interaction[] = [
  {
    id: 'i1',
    clientId: 'c1',
    type: 'call',
    title: 'Llamada de seguimiento',
    description: 'Conversación sobre la cotización de la Hilux. Mostró interés en el financiamiento.',
    date: '2024-03-08',
    duration: 15,
    outcome: 'Interesado',
    nextSteps: 'Enviar opciones de financiamiento',
    createdAt: '2024-03-08T10:30:00',
  },
  {
    id: 'i2',
    clientId: 'c1',
    type: 'meeting',
    title: 'Visita a showroom',
    description: 'Roberto visitó el showroom con su esposa. Probaron la Hilux y la Explorer.',
    date: '2024-03-05',
    duration: 90,
    outcome: 'Muy interesado en Hilux',
    nextSteps: 'Preparar cotización formal',
    createdAt: '2024-03-05T15:00:00',
  },
  {
    id: 'i3',
    clientId: 'c2',
    type: 'email',
    title: 'Cotización BMW X5',
    description: 'Envié la cotización detallada con opciones de equipamiento.',
    date: '2024-03-05',
    outcome: 'Pendiente respuesta',
    createdAt: '2024-03-05T11:00:00',
  },
  {
    id: 'i4',
    clientId: 'c4',
    type: 'message',
    title: 'WhatsApp - Colores disponibles',
    description: 'Ana preguntó por colores disponibles de la CX-5. Le envié fotos.',
    date: '2024-03-07',
    outcome: 'Le gustó el rojo',
    nextSteps: 'Agendar visita al showroom',
    createdAt: '2024-03-07T14:20:00',
  },
  {
    id: 'i5',
    clientId: 'c6',
    type: 'call',
    title: 'Primera llamada',
    description: 'Laura mencionó que la refirió Roberto García. Busca un Audi Q7 para su familia.',
    date: '2024-03-09',
    duration: 20,
    outcome: 'Muy interesada',
    nextSteps: 'Agendar cita para prueba de manejo',
    createdAt: '2024-03-09T09:00:00',
  },
  {
    id: 'i6',
    clientId: 'c3',
    type: 'meeting',
    title: 'Reunión en Expo Automotriz',
    description: 'Conocí a Juan Carlos en la expo. Interesado en pickup para su negocio.',
    date: '2024-03-01',
    duration: 30,
    outcome: 'Nuevo prospecto',
    nextSteps: 'Enviar catálogo y cotización',
    createdAt: '2024-03-01T12:00:00',
  },
];

// Mock Follow-ups
export const followUps: FollowUp[] = [
  {
    id: 'f1',
    clientId: 'c1',
    title: 'Enviar opciones de financiamiento',
    description: 'Preparar documento con 3 opciones de financiamiento para la Toyota Hilux',
    dueDate: '2024-03-11',
    dueTime: '10:00',
    priority: 'high',
    status: 'pending',
    reminder: true,
    createdAt: '2024-03-08',
  },
  {
    id: 'f2',
    clientId: 'c2',
    title: 'Llamar para confirmar recepción de cotización',
    description: 'Verificar que María recibió la cotización del BMW X5',
    dueDate: '2024-03-10',
    dueTime: '11:00',
    priority: 'medium',
    status: 'pending',
    reminder: true,
    createdAt: '2024-03-05',
  },
  {
    id: 'f3',
    clientId: 'c4',
    title: 'Agendar visita showroom',
    description: 'Coordinar con Ana su visita para ver la Mazda CX-5 roja',
    dueDate: '2024-03-12',
    dueTime: '15:00',
    priority: 'medium',
    status: 'pending',
    reminder: true,
    createdAt: '2024-03-07',
  },
  {
    id: 'f4',
    clientId: 'c6',
    title: 'Prueba de manejo Audi Q7',
    description: 'Confirmar fecha y hora para prueba de manejo con Laura',
    dueDate: '2024-03-11',
    dueTime: '14:00',
    priority: 'high',
    status: 'pending',
    reminder: true,
    createdAt: '2024-03-09',
  },
  {
    id: 'f5',
    clientId: 'c3',
    title: 'Enviar cotización Nissan NP300',
    description: 'Preparar y enviar cotización formal con especificaciones',
    dueDate: '2024-03-09',
    priority: 'medium',
    status: 'overdue',
    reminder: true,
    createdAt: '2024-03-01',
  },
  {
    id: 'f6',
    clientId: 'c5',
    title: 'Intentar contacto nuevamente',
    description: 'Fernando no responde, intentar por LinkedIn',
    dueDate: '2024-03-15',
    priority: 'low',
    status: 'pending',
    reminder: false,
    createdAt: '2024-02-20',
  },
];

// Helper functions
export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id);
}

export function getClientInteractions(clientId: string): Interaction[] {
  return interactions.filter(i => i.clientId === clientId).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getClientFollowUps(clientId: string): FollowUp[] {
  return followUps.filter(f => f.clientId === clientId);
}

export function getPendingFollowUps(): FollowUp[] {
  return followUps.filter(f => f.status === 'pending' || f.status === 'overdue');
}

export function getOverdueFollowUps(): FollowUp[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return followUps.filter(f => {
    const dueDate = new Date(f.dueDate);
    return f.status === 'pending' && dueDate < today;
  });
}

export function getTodayFollowUps(): FollowUp[] {
  const today = new Date().toISOString().split('T')[0];
  return followUps.filter(f => f.dueDate === today && f.status === 'pending');
}

export function getRecentInteractions(limit: number = 5): Interaction[] {
  return [...interactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getActiveClients(): Client[] {
  return clients.filter(c => c.status === 'active');
}

export function getProspectClients(): Client[] {
  return clients.filter(c => c.status === 'prospect');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusLabel(status: ClientStatus): string {
  const labels: Record<ClientStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    prospect: 'Prospecto',
    lost: 'Perdido',
  };
  return labels[status];
}

export function getInteractionTypeLabel(type: InteractionType): string {
  const labels: Record<InteractionType, string> = {
    call: 'Llamada',
    meeting: 'Reunión',
    email: 'Email',
    message: 'Mensaje',
    visit: 'Visita',
  };
  return labels[type];
}

export function getPriorityLabel(priority: FollowUpPriority): string {
  const labels: Record<FollowUpPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };
  return labels[priority];
}

export function getFollowUpStatusLabel(status: FollowUpStatus): string {
  const labels: Record<FollowUpStatus, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
    overdue: 'Vencido',
  };
  return labels[status];
}

export function getDashboardStats() {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const prospects = clients.filter(c => c.status === 'prospect').length;
  const pendingFollowUps = followUps.filter(f => f.status === 'pending').length;
  const overdueFollowUps = getOverdueFollowUps().length;
  const todayFollowUps = getTodayFollowUps().length;
  const totalInteractions = interactions.length;
  const thisMonthInteractions = interactions.filter(i => {
    const date = new Date(i.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return {
    totalClients,
    activeClients,
    prospects,
    pendingFollowUps,
    overdueFollowUps,
    todayFollowUps,
    totalInteractions,
    thisMonthInteractions,
  };
}

export function getVehicleTypeLabel(type: Vehicle['type']): string {
  const labels: Record<Vehicle['type'], string> = {
    sedan: 'Sedán',
    suv: 'SUV',
    pickup: 'Pickup',
    hatchback: 'Hatchback',
    van: 'Van',
    coupe: 'Coupé',
  };
  return labels[type];
}

export function getVehicleInterestLabel(interest: Vehicle['interest']): string {
  const labels: Record<Vehicle['interest'], string> = {
    buy: 'Comprar',
    sell: 'Vender',
    trade: 'Intercambiar',
  };
  return labels[interest];
}
