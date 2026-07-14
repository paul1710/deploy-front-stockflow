import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../components/Button';
import { Box, LineChart, Users2, ShieldCheck, Zap } from 'lucide-react';
import Card from '../components/Card';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Box,
      title: 'Control de Stock',
      description: 'Monitoriza tus existencias con precisión milimétrica y alertas de bajo nivel.'
    },
    {
      icon: LineChart,
      title: 'Analítica Avanzada',
      description: 'Métricas, KPIs e indicadores de rendimiento generados en tiempo real.'
    },
    {
      icon: Users2,
      title: 'Cartera de Clientes',
      description: 'Fideliza y administra los datos de tus compradores en un entorno seguro.'
    },
    {
      icon: ShieldCheck,
      title: 'Auditoría Continua',
      description: 'Trazabilidad absoluta de cada movimiento y transacción en el sistema.'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Minimalista */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">StockFlow</h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Acceder
            </Button>
            <Button size="sm" onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              Crear Cuenta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section Rediseñado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold border border-emerald-200">
              <Zap className="w-4 h-4" />
              <span>Plataforma v2.0 Disponible</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              El control absoluto de tu almacén en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">tiempo real</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              StockFlow transforma la logística de tu negocio centralizando productos, clientes y finanzas en una interfaz diseñada para la máxima productividad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 font-bold px-8">
                Iniciar prueba gratuita
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="border-slate-300 hover:bg-slate-50 text-slate-700 px-8">
                Ingresar al panel
              </Button>
            </div>
          </div>

          {/* Hero Abstract Graphic */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-teal-500/20 rounded-[3rem] blur-3xl transform rotate-3"></div>
            <Card className="relative p-8 bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem]">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="w-32 h-4 bg-emerald-100 rounded-full"></div>
                  <div className="w-12 h-4 bg-slate-100 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid Dark */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:flex md:justify-between md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Herramientas Operativas</h2>
              <p className="text-slate-400 text-lg">
                Módulos integrados para resolver los desafíos de la gestión moderna.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-colors">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-slate-100 mb-3 text-lg">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800">StockFlow</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} StockFlow Systems. Licencia comercial.</p>
        </div>
      </footer>
    </div>
  );
}