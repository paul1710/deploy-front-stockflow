import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from './Input';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;

    const levels = [
      { strength: 1, label: 'Débil', color: 'destructive' },
      { strength: 2, label: 'Regular', color: 'warning' },
      { strength: 3, label: 'Buena', color: 'secondary' },
      { strength: 4, label: 'Muy fuerte', color: 'secondary' },
    ];
    return levels[strength - 1] || { strength: 0, label: '', color: '' };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Nombre requerido';
    }

    if (!email || !validateEmail(email)) {
      errors.email = 'Correo válido requerido';
    }

    if (!password || password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Error al registrar. El correo puede estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Crear Cuenta</h2>
            <p className="text-muted-foreground mt-2">Regístrate para comenzar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              error={validationErrors.name}
              placeholder="Juan Pérez"
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validateEmail(e.target.value)) {
                  setValidationErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              error={validationErrors.email}
              placeholder="tu@email.com"
              required
            />

            <div>
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors(prev => ({ ...prev, password: undefined }));
                }}
                error={validationErrors.password}
                placeholder="••••••••"
                required
                showPasswordToggle={true}
              />
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.color === 'destructive' ? 'bg-destructive' :
                        passwordStrength.color === 'warning' ? 'bg-warning' :
                        'bg-secondary'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                  <Badge variant={passwordStrength.color as any}>{passwordStrength.label}</Badge>
                </div>
              )}
            </div>

            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value === password) {
                  setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              error={validationErrors.confirmPassword}
              success={confirmPassword && confirmPassword === password ? '✓ Contraseñas coinciden' : undefined}
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

            {success && (
              <div className="p-3 bg-secondary/10 text-secondary text-sm rounded-lg border border-secondary/30 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>¡Registro exitoso! Redirigiendo...</span>
              </div>
            )}

            <Button type="submit" className="w-full mt-6" loading={loading}>
              Registrarse
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block text-center px-4 py-2.5 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-smooth"
          >
            Inicia sesión
          </Link>
        </Card>
      </div>
    </div>
  );
}