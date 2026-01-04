import React, { useState, useRef } from 'react';
import { 
  LayoutGrid, ShoppingCart, Users, Package, FileText, 
  Settings, DollarSign, Calendar, ChevronLeft, Search, 
  Plus, Minus, Trash2, Check, BarChart3, Truck, Printer,
  Bluetooth, Wifi, Usb, RefreshCw, FileCheck
} from 'lucide-react';
import { SERVICES, PRODUCTS, STYLISTS, APP_NAME } from '../constants';
import { Service, Product, CartItem, PrinterDevice } from '../types';
import { Button } from './Button';

interface AdminDashboardProps {
  onExit: () => void;
}

type AdminView = 'menu' | 'pos' | 'products' | 'agenda' | 'stats' | 'printer';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [currentView, setCurrentView] = useState<AdminView>('menu');

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Product State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Printer State
  const [activeConnTab, setActiveConnTab] = useState<'bluetooth' | 'wifi' | 'usb'>('bluetooth');
  const [isScanning, setIsScanning] = useState(false);
  const [connectedPrinter, setConnectedPrinter] = useState<PrinterDevice | null>(null);
  const [availableDevices, setAvailableDevices] = useState<PrinterDevice[]>([]);

  // --- SUB-COMPONENTS ---

  const renderMenu = () => (
    <div className="p-4 grid grid-cols-2 gap-4 pb-20 overflow-y-auto">
      <DashboardCard 
        icon={ShoppingCart} label="Ventas / POS" color="bg-green-500" 
        onClick={() => setCurrentView('pos')} 
      />
      <DashboardCard 
        icon={Calendar} label="Agenda" color="bg-indigo-500" 
        onClick={() => setCurrentView('agenda')} 
      />
      <DashboardCard 
        icon={Package} label="Productos" color="bg-blue-500" 
        onClick={() => setCurrentView('products')} 
      />
      <DashboardCard 
        icon={Printer} label="Config. Impresora" color="bg-gray-800" 
        onClick={() => setCurrentView('printer')} 
      />
      <DashboardCard 
        icon={Users} label="Clientes" color="bg-purple-500" 
        onClick={() => alert('Módulo de Clientes: Catálogo e Historial')} 
      />
      <DashboardCard 
        icon={Truck} label="Proveedores" color="bg-orange-500" 
        onClick={() => alert('Módulo de Compras y Proveedores')} 
      />
       <DashboardCard 
        icon={DollarSign} label="Caja" color="bg-teal-500" 
        onClick={() => alert('Corte de Caja, Ingresos y Gastos')} 
      />
      <DashboardCard 
        icon={BarChart3} label="Reportes" color="bg-red-500" 
        onClick={() => setCurrentView('stats')} 
      />
    </div>
  );

  const renderPrinterSettings = () => {
    
    const handleScan = () => {
      setIsScanning(true);
      setAvailableDevices([]);
      // Simulate scanning delay
      setTimeout(() => {
        setIsScanning(false);
        if (activeConnTab === 'bluetooth') {
          setAvailableDevices([
            { id: 'bt1', name: 'Thermal Printer 58mm', type: 'bluetooth', address: '00:11:22:33:AA:BB', status: 'disconnected' },
            { id: 'bt2', name: 'Epson TM-P20', type: 'bluetooth', address: '00:11:22:33:FF:EE', status: 'disconnected' }
          ]);
        } else if (activeConnTab === 'wifi') {
          setAvailableDevices([
             { id: 'wf1', name: 'Barber Counter Printer', type: 'wifi', address: '192.168.1.50', status: 'disconnected' }
          ]);
        }
      }, 2000);
    };

    const handleConnect = (device: PrinterDevice) => {
      setConnectedPrinter({...device, status: 'connected'});
    };

    const handleTestPrint = () => {
       // Logic to trigger browser print dialog as a fallback for PWA
       // In a native android wrapper, this would send ESC/POS commands
       const receiptContent = `
        <html>
          <head>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; }
            .header { text-align: center; margin-bottom: 10px; }
            .line { border-bottom: 1px dashed #000; margin: 5px 0; }
            .total { font-weight: bold; text-align: right; margin-top: 10px; }
          </style>
          </head>
          <body>
            <div class="header">
              <h3>${APP_NAME}</h3>
              <p>Ticket de Prueba</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="line"></div>
            <div>Corte Fade ........... $25.00</div>
            <div>Producto X ........... $15.00</div>
            <div class="line"></div>
            <div class="total">TOTAL: $40.00</div>
            <br/>
            <div style="text-align:center;">¡Gracias por su visita!</div>
          </body>
        </html>
       `;
       
       const printWindow = window.open('', '', 'height=600,width=400');
       if(printWindow) {
         printWindow.document.write(receiptContent);
         printWindow.document.close();
         printWindow.focus();
         printWindow.print();
       } else {
         alert('Por favor permite ventanas emergentes para imprimir.');
       }
    };

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Connection Tabs */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => { setActiveConnTab('bluetooth'); setAvailableDevices([]); }}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${activeConnTab === 'bluetooth' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <Bluetooth size={16} className="mr-2"/> Bluetooth
            </button>
            <button 
              onClick={() => { setActiveConnTab('wifi'); setAvailableDevices([]); }}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${activeConnTab === 'wifi' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <Wifi size={16} className="mr-2"/> WiFi/Lan
            </button>
             <button 
              onClick={() => { setActiveConnTab('usb'); setAvailableDevices([]); }}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${activeConnTab === 'usb' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <Usb size={16} className="mr-2"/> USB
            </button>
          </div>
        </div>

        {/* Scan / Status Area */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Connected Device Card */}
          {connectedPrinter && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <div className="text-green-800 font-bold text-sm flex items-center">
                  <Printer size={16} className="mr-2"/> Conectado
                </div>
                <div className="text-gray-700 font-medium">{connectedPrinter.name}</div>
                <div className="text-xs text-gray-500 font-mono">{connectedPrinter.address}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setConnectedPrinter(null)}>Desconectar</Button>
            </div>
          )}

          {/* Action Area */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Dispositivos Disponibles</h3>
            <button 
              onClick={handleScan} 
              disabled={isScanning}
              className={`p-2 rounded-full ${isScanning ? 'bg-gray-200 animate-spin' : 'bg-indigo-100 text-indigo-600'}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {isScanning ? (
             <div className="text-center py-10 text-gray-400">
                <p>Buscando impresoras {activeConnTab}...</p>
             </div>
          ) : (
             <div className="space-y-3">
               {availableDevices.length === 0 && !connectedPrinter && (
                 <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                   <p className="text-sm">No se encontraron dispositivos.</p>
                   <p className="text-xs mt-1">Presiona escanear para buscar.</p>
                 </div>
               )}
               {availableDevices.map(dev => (
                 <div key={dev.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-800">{dev.name}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        {activeConnTab === 'bluetooth' && <Bluetooth size={12} className="mr-1"/>}
                        {activeConnTab === 'wifi' && <Wifi size={12} className="mr-1"/>}
                        {dev.address}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleConnect(dev)}>Conectar</Button>
                 </div>
               ))}
             </div>
          )}

          {/* Configuration & Preview Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-800 mb-4">Configuración del Ticket</h3>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-sm text-gray-600">Ancho de papel</span>
                 <select className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-700">
                   <option>58mm</option>
                   <option>80mm</option>
                 </select>
               </div>
               
               {/* Mini Preview */}
               <div className="bg-gray-100 p-4 rounded-lg font-mono text-[10px] text-gray-600 mb-4 leading-tight mx-auto max-w-[200px] border-t-4 border-gray-300">
                  <div className="text-center mb-2 font-bold">{APP_NAME.toUpperCase()}</div>
                  <div className="text-center mb-2">****************</div>
                  <div className="flex justify-between"><span>Concepto</span><span>$$$</span></div>
                  <div className="flex justify-between"><span>Corte</span><span>25.0</span></div>
                  <div className="text-right font-bold mt-2">TOTAL: $25.0</div>
                  <div className="text-center mt-2">****************</div>
               </div>

               <Button fullWidth onClick={handleTestPrint}>
                 <FileCheck size={18} className="mr-2"/> Imprimir Prueba
               </Button>
               <p className="text-[10px] text-gray-400 text-center mt-2">
                 * Utiliza el servicio de impresión de Android/iOS
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPOS = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const addToCart = (item: Service | Product, type: 'service' | 'product') => {
      const existing = cart.find(i => i.id === item.id && i.type === type);
      if (existing) {
        setCart(cart.map(i => i.id === item.id && i.type === type ? {...i, quantity: i.quantity + 1} : i));
      } else {
        setCart([...cart, { id: item.id, name: item.name, price: item.price, type, quantity: 1 }]);
      }
    };

    return (
      <div className="flex flex-col h-full">
        {/* Cart Area */}
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto max-h-[40vh]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} className="mb-2 opacity-50"/>
              <p>Carrito Vacío</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.type === 'service' ? 'Servicio' : 'Producto'}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-indigo-600 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => setCart(cart.filter(c => c !== item))}
                      className="text-red-400"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Actions */}
        <div className="bg-white p-4 border-t border-gray-200 shadow-up">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Total a Pagar</span>
            <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
             <Button variant="outline" onClick={() => setCart([])}>Limpiar</Button>
             <Button onClick={() => { alert('Venta realizada con éxito\nTicket generado'); setCart([]); }}>Cobrar</Button>
          </div>
        </div>

        {/* Catalog Selection */}
        <div className="bg-gray-100 p-2 overflow-y-auto flex-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Servicios Rápidos</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {SERVICES.slice(0,4).map(s => (
              <button key={s.id} onClick={() => addToCart(s, 'service')} className="bg-white p-3 rounded shadow-sm text-left active:bg-gray-50">
                <div className="font-semibold text-sm truncate">{s.name}</div>
                <div className="text-xs text-gray-500">${s.price}</div>
              </button>
            ))}
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Productos</h3>
          <div className="grid grid-cols-2 gap-2">
            {products.map(p => (
              <button key={p.id} onClick={() => addToCart(p, 'product')} className="bg-white p-3 rounded shadow-sm text-left active:bg-gray-50">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-gray-500">${p.price} | Stock: {p.stock}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <div className="flex flex-col h-full bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-4">
           <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o código..." 
              className="w-full bg-white rounded-lg py-2.5 pl-10 pr-4 text-sm border border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </div>
           <Button size="sm"><Plus size={18}/></Button>
        </div>

        <div className="space-y-3 overflow-y-auto">
          {products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.includes(searchTerm))
            .map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded mr-2">{p.code}</span>
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded">{p.category}</span>
                </div>
                <button className="text-gray-400 hover:text-indigo-600"><Settings size={16}/></button>
              </div>
              <h3 className="font-bold text-gray-800">{p.name}</h3>
              <div className="flex justify-between items-end mt-3">
                 <div>
                    <div className="text-xs text-gray-500">Costo: ${p.cost}</div>
                    <div className="font-bold text-indigo-600">P. Público: ${p.price}</div>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-400 mb-1">Stock Actual</div>
                    <div className={`font-mono font-bold ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                      {p.stock} pza
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgenda = () => (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <h3 className="font-bold text-gray-800 mb-2">Resumen del Día</h3>
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">8</div>
            <div className="text-gray-500">Citas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$1.2k</div>
            <div className="text-gray-500">Estimado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">2</div>
            <div className="text-gray-500">Pendientes</div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-700 mb-3 ml-1">Próximas Citas</h3>
      <div className="space-y-3">
        {[
          { time: '10:00 AM', client: 'Juan Perez', service: 'Corte Fade', stylist: 'Carlos', status: 'confirmed' },
          { time: '11:30 AM', client: 'Maria Lopez', service: 'Manicura Gel', stylist: 'Ana', status: 'confirmed' },
          { time: '01:00 PM', client: 'Pedro Sola', service: 'Afeitado', stylist: 'Carlos', status: 'pending' },
        ].map((cita, i) => (
           <div key={i} className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm flex">
              <div className="mr-4 text-center min-w-[3rem]">
                <div className="text-xs text-gray-400 font-bold">HORA</div>
                <div className="font-bold text-gray-800">{cita.time.split(' ')[0]}</div>
                <div className="text-xs text-gray-500">{cita.time.split(' ')[1]}</div>
              </div>
              <div className="flex-1">
                 <div className="font-bold text-gray-900">{cita.client}</div>
                 <div className="text-sm text-gray-600">{cita.service}</div>
                 <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Users size={12} className="mr-1"/> Con {cita.stylist}
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );

  const getHeaderTitle = () => {
    switch(currentView) {
      case 'pos': return 'Punto de Venta';
      case 'products': return 'Inventario';
      case 'agenda': return 'Agenda General';
      case 'printer': return 'Conectividad';
      case 'stats': return 'Reportes';
      default: return 'Panel de Control';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          {currentView !== 'menu' && (
            <button onClick={() => setCurrentView('menu')} className="mr-3 hover:bg-gray-700 p-1 rounded-full">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="font-bold text-lg">{getHeaderTitle()}</h1>
        </div>
        {currentView === 'menu' && (
           <button onClick={onExit} className="text-xs bg-red-600 px-3 py-1.5 rounded font-medium hover:bg-red-700">
             Salir
           </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'menu' && renderMenu()}
        {currentView === 'pos' && renderPOS()}
        {currentView === 'products' && renderProducts()}
        {currentView === 'agenda' && renderAgenda()}
        {currentView === 'printer' && renderPrinterSettings()}
        {currentView === 'stats' && (
           <div className="p-8 text-center text-gray-500">
             <BarChart3 size={64} className="mx-auto mb-4 opacity-30"/>
             <p>Visualización de Gráficas de Rendimiento</p>
             <p className="text-sm mt-2">(Módulo de Reportes)</p>
           </div>
        )}
      </div>
    </div>
  );
};

// Helper sub-component
const DashboardCard = ({ icon: Icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`${color} text-white p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center aspect-square active:scale-95 transition-transform`}
  >
    <Icon size={32} className="mb-2" />
    <span className="font-bold text-sm text-center leading-tight">{label}</span>
  </button>
);
