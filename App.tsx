import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ServiceCard } from './components/ServiceCard';
import { AIAdvisor } from './components/AIAdvisor';
import { AdminDashboard } from './components/AdminDashboard';
import { SERVICES, STYLISTS, APP_NAME } from './constants';
import { Category, Service, Appointment } from './types';
import { Search, Bell, MapPin, Scissors, Droplets, Smile, Star, Briefcase } from 'lucide-react';
import { Button } from './components/Button';

// Helper component for category pills
interface CategoryPillProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ 
  active, 
  label, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active 
        ? 'bg-gray-900 text-white shadow-md' 
        : 'bg-white text-gray-600 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Simple booking flow state
  const [bookingService, setBookingService] = useState<Service | null>(null);

  const handleBook = (service: Service) => {
    // For this demo, we'll just add a dummy appointment and show an alert
    const newAppointment: Appointment = {
      id: Math.random().toString(),
      serviceId: service.id,
      stylistId: STYLISTS[0].id,
      date: new Date(),
      status: 'pending'
    };
    setAppointments([...appointments, newAppointment]);
    setBookingService(service);
    // In a real app, this would open a modal for date/stylist selection
    setTimeout(() => {
        alert(`¡Reserva iniciada para ${service.name}! (Simulación)`);
        setBookingService(null);
        setCurrentTab('bookings');
    }, 500);
  };

  const filteredServices = selectedCategory === 'Todos' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === selectedCategory);

  const renderHome = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white p-6 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Ubicación actual</p>
            <div className="flex items-center text-indigo-600 font-bold">
              <MapPin size={16} className="mr-1" />
              <span>Ciudad de México, MX</span>
            </div>
          </div>
          <div className="relative">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, <span className="text-indigo-600">Andrea</span>
        </h1>
        <p className="text-gray-500 text-sm">¿Qué tratamiento deseas hoy?</p>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <input 
            type="text" 
            placeholder="Buscar servicios, estilistas..." 
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mt-4">
        <h2 className="font-bold text-gray-900 mb-3 text-lg">Categorías</h2>
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          <CategoryPill active={selectedCategory === 'Todos'} label="Todos" onClick={() => setSelectedCategory('Todos')} />
          {Object.values(Category).filter(c => c !== 'Producto').map(cat => (
             <CategoryPill 
               key={cat} 
               active={selectedCategory === cat} 
               label={cat} 
               onClick={() => setSelectedCategory(cat)} 
             />
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-6 mt-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg">
           <div className="relative z-10">
             <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">Promo</span>
             <h3 className="font-bold text-lg mt-2 w-2/3">20% OFF en tu primer Spa Facial</h3>
             <button className="mt-3 text-xs bg-white text-indigo-600 px-4 py-2 rounded-full font-bold shadow-sm">
               Reservar Ahora
             </button>
           </div>
           <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 bg-[url('https://picsum.photos/300/300')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
      </div>

      {/* Services List */}
      <div className="px-6 mt-8">
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Servicios Populares</h2>
        <div className="space-y-4">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} onBook={handleBook} />
          ))}
        </div>
      </div>
      
       {/* Top Stylists */}
       <div className="px-6 mt-8 mb-4">
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Profesionales Top</h2>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
          {STYLISTS.map(stylist => (
            <div key={stylist.id} className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <img src={stylist.avatarUrl} alt={stylist.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-indigo-100" />
              <h3 className="font-semibold text-sm text-gray-900">{stylist.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{stylist.role}</p>
              <div className="flex items-center text-amber-400 text-xs font-bold">
                <Star size={10} fill="currentColor" className="mr-1"/>
                {stylist.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
      </div>
      <div className="p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-300">
              <CalendarIcon size={40} />
            </div>
            <p className="text-gray-500 text-lg">No tienes citas próximas</p>
            <Button className="mt-4" onClick={() => setCurrentTab('home')}>Explorar Servicios</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, idx) => {
              const srv = SERVICES.find(s => s.id === apt.serviceId);
              return (
                <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{srv?.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {apt.date.toLocaleDateString()} - 10:00 AM
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                      Pendiente
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">Reprogramar</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Cancelar</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-indigo-600 p-8 text-white pt-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-20 h-20 rounded-full bg-white p-1">
            <img src="https://picsum.photos/200/200?random=99" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Andrea Martinez</h2>
            <p className="text-indigo-200 text-sm">+52 55 1234 5678</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 -mt-6">
        {/* Admin Access Card */}
        <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between cursor-pointer" onClick={() => setIsAdminMode(true)}>
           <div className="flex items-center">
             <div className="bg-gray-800 p-2 rounded-lg mr-3">
               <Briefcase size={20} className="text-indigo-400"/>
             </div>
             <div>
               <h3 className="font-bold text-sm">Panel Administrativo</h3>
               <p className="text-xs text-gray-400">Acceso a Inventario, Ventas y Caja</p>
             </div>
           </div>
           <div className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Entrar</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6">
          <ProfileMenuItem icon={Scissors} label="Mis Estilos Guardados" />
          <ProfileMenuItem icon={Star} label="Reseñas" />
          <ProfileMenuItem icon={Droplets} label="Preferencias de Spa" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-2">
          <ProfileMenuItem icon={Bell} label="Notificaciones" hasToggle />
          <ProfileMenuItem icon={Smile} label="Invitar Amigos" />
        </div>
        
        <button className="w-full text-center text-red-500 font-medium mt-8 text-sm hover:underline">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  const CalendarIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  );

  if (isAdminMode) {
    return <AdminDashboard onExit={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl overflow-hidden relative">
      {currentTab === 'home' && renderHome()}
      {currentTab === 'bookings' && renderBookings()}
      {currentTab === 'ai-advisor' && <AIAdvisor />}
      {currentTab === 'profile' && renderProfile()}

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

// Helper for profile menu
const ProfileMenuItem = ({ icon: Icon, label, hasToggle }: { icon: any, label: string, hasToggle?: boolean }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border-b border-gray-50 last:border-0">
    <div className="flex items-center text-gray-700">
      <div className="bg-gray-100 p-2 rounded-lg mr-3 text-gray-600">
        <Icon size={18} />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    {hasToggle ? (
      <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
      </div>
    ) : (
      <div className="text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>
    )}
  </div>
);

export default App;
