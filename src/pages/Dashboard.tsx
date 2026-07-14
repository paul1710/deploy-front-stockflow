import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useProductos } from '../hooks/useProductos';
import { useClientes } from '../hooks/useClientes';
import { useVentas } from '../hooks/useVentas';
import { ShoppingCart, Box, Users, Bookmark, Briefcase, Activity, LogOut, LayoutDashboard, TrendingUp } from 'lucide-react';

const toDisplayPrice = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { data: productos = [], isLoading: loadingProductos } = useProductos();
  const { data: clientes = [], isLoading: loadingClientes } = useClientes();
  const { data: ventas = [], isLoading: loadingVentas } = useVentas();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const stockTotal = productos.reduce((sum, producto) => sum + (producto.stock || 0), 0);
  const ingresosTotal = ventas.reduce((sum, venta) => sum + toDisplayPrice(venta.total), 0);

  const menuItems = [
    { title: 'Terminal de Venta', description: 'Atiende pedidos y crea ventas de forma rápida', icon: Briefcase, path: '/catalogo', color: 'from-emerald-500 to-teal-600' },
    { title: 'Transacciones', description: `${ventas.length} ventas registradas`, icon: Activity, path: '/admin/ventas', color: 'from-slate-700 to-slate-900' },
    { title: 'Inventario Base', description: `${productos.length} productos disponibles`, icon: Box, path: '/admin/productos', color: 'from-teal-600 to-cyan-700' },
    { title: 'Clasificaciones', description: 'Organiza productos por categorías', icon: Bookmark, path: '/admin/categorias', color: 'from-indigo-500 to-blue-600' },
    { title: 'Directorio', description: `${clientes.length} clientes registrados`, icon: Users, path: '/admin/clientes', color: 'from-violet-500 to-purple-600' },
    ...(totalItems > 0 ? [{ title: 'Bandeja de Salida', description: `${totalItems} artículos en cola`, icon: ShoppingCart, path: '/carrito', color: 'from-rose-500 to-pink-600', highlight: true }] : []),
  ];

  const stats = [
    { label: 'Productos activos', value: loadingProductos ? '...' : String(productos.length), change: `${stockTotal} unidades en stock`, icon: Box },
    { label: 'Clientes registrados', value: loadingClientes ? '...' : String(clientes.length), change: 'Base de clientes actualizada', icon: Users },
    { label: 'Ventas registradas', value: loadingVentas ? '...' : String(ventas.length), change: 'Historial disponible', icon: TrendingUp },
    { label: 'Ingresos totales', value: loadingVentas ? '...' : `$${ingresosTotal.toFixed(2)}`, change: 'Suma de transacciones', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">Centro de Operaciones</h1>
              <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">StockFlow Env</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors group"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-4xl font-extrabold text-slate-800 mt-2 tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-xs text-slate-500">{stat.change}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <Icon className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Módulos del Sistema</h2>
          <p className="text-sm text-slate-500 mb-6">Selecciona un área de trabajo para continuar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group relative overflow-hidden rounded-2xl text-left outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

                  {item.highlight && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 blur-2xl rounded-full"></div>
                  )}

                  <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {item.highlight && (
                        <span className="px-2 py-1 bg-white/20 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-md">
                          Activo
                        </span>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="font-bold text-white text-xl tracking-tight">{item.title}</h3>
                      <p className="text-sm text-white/80 font-medium mt-1">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Message */}
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-sm text-emerald-800">
            <strong>Sesión activa.</strong> Todas las operaciones y transacciones realizadas en este módulo quedan registradas bajo tu usuario para auditoría.
          </p>
        </div>
      </main>
    </div>
  );
}