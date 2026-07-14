import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from './Input';
import Button from './Button';
import Card from './Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: string) => {
    setEmail(e);
    if (e && !validateEmail(e)) {
      setValidationErrors(prev => ({ ...prev, email: 'Correo inválido' }));
    } else {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: string) => {
    setPassword(e);
    if (e.length > 0 && e.length < 6) {
      setValidationErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres' }));
    } else {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !validateEmail(email)) {
      setValidationErrors({ email: 'Correo requerido y válido' });
      return;
    }

    if (!password || password.length < 6) {
      setValidationErrors({ password: 'Contraseña requerida (mín. 6 caracteres)' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-muted-foreground mt-2">Bienvenido a Inventario Maestro</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              error={validationErrors.email}
              placeholder="tu@email.com"
              required
              showPasswordToggle={false}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={validationErrors.password}
              placeholder="••••••••"
              required
              showPasswordToggle={true}
            />

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/30 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full mt-6" loading={loading}>
              Iniciar Sesión
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">¿No tienes cuenta?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="block text-center px-4 py-2.5 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-smooth"
          >
            Registrarse
          </Link>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <a href="#" className="text-primary hover:text-primary/80 font-medium">¿Olvidaste tu contraseña?</a>
          </p>
        </Card>
      </div>
    </div>
  );
}