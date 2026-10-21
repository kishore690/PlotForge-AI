import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Feather, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import AnimatedStoryBackdrop from '../components/common/AnimatedStoryBackdrop';
import { login, loginWithGoogle, register as createAccount } from "../services/authService";
const GoogleSignInButton = lazy(() => import('../components/auth/GoogleSignInButton'));
const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());
export default function Login({ register = false }) {
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => new URLSearchParams(window.location.search).get('session') === 'expired' ? 'Your session expired. Sign in again to continue.' : '');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const finishSignIn = (response) => {
    if (!response.token) throw new Error('The server did not return an authentication token.');
    localStorage.setItem('token', response.token);
    const returnTo = new URLSearchParams(location.search).get('returnTo');
    const destination = location.state?.from?.pathname || (returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard');
    navigate(destination, { replace: true });
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setSubmitting(true);
    try {
      finishSignIn(await loginWithGoogle(credential));
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = register
        ? await createAccount({ fullName, username, email, password })
        : await login({ email, password });

      finishSignIn(response);
    } catch (err) {
      setError(err.message || (register ? 'Account creation failed.' : 'Login failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-8">
      <AnimatedStoryBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border/90 bg-card/95 p-8 shadow-[0_24px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[#45A29E] flex items-center justify-center">
            <Feather size={17} className="text-white" />
          </div>
          <span className="font-serif-display text-xl tracking-tight">PlotForge <span className="text-primary">AI</span></span>
        </div>

        <h2 className="text-lg font-semibold text-center mb-1">{register ? 'Create your account' : 'Welcome back'}</h2>
        <p className="text-sm text-ink-soft text-center mb-4">
          {register ? 'Start crafting stories in minutes.' : 'Log in to continue your stories.'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {register && (
            <FloatingInput label="Full Name" type="text" value={fullName} onChange={setFullName} required autoComplete="name" />
          )}
          {register && <FloatingInput label="Username" type="text" value={username} onChange={setUsername} required autoComplete="username" />}
          <FloatingInput label="Email" type="email" icon={Mail} value={email} onChange={setEmail} required autoComplete="email" />
          <div className="relative">
            <FloatingInput label="Password" type={showPw ? 'text' : 'password'} icon={Lock} value={password} onChange={setPassword} required autoComplete={register ? 'new-password' : 'current-password'} />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-primary -mt-1">{error}</p>
          )}

          <Button variant="primary" size="md" className="w-full mt-2" type="submit" disabled={submitting}>
            {submitting ? (register ? 'Creating account…' : 'Logging in…') : (register ? 'Create Account' : 'Log In')}
          </Button>
        </form>

        {hasGoogleClientId && (
          <>
            <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs text-ink-soft">or continue with</span><span className="h-px flex-1 bg-border" /></div>
            <Suspense fallback={<p className="text-center text-xs text-ink-soft">Loading Google sign-in…</p>}>
              <GoogleSignInButton register={register} disabled={submitting} onCredential={handleGoogleCredential} onError={setError} />
            </Suspense>
          </>
        )}

        <p className="text-center text-xs text-ink-soft mt-7">
          {register ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={register ? '/login' : '/register'} className="text-primary hover:text-primary-hover font-medium">
            {register ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function FloatingInput({ label, type, icon: Icon, value, onChange, required, autoComplete }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />}
      <input
        type={type}
        placeholder={label}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-bg border border-border rounded-xl py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/50 transition-colors ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
      />
    </div>
  );
}
