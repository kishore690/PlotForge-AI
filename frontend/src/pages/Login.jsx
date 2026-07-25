import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Mail, Lock, Eye, EyeOff, Info } from 'lucide-react';
import Button from '../components/common/Button';
import { login } from "../services/authService";
export default function Login({ register = false }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {

    const response = await login({
      email,
      password
    });

    // Save JWT
    localStorage.setItem("token", response.token);

    // Redirect
    navigate("/dashboard");

  } catch (err) {

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Login failed. Please try again.");
    }

  }
};

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-card border border-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-red-900 flex items-center justify-center">
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
            <FloatingInput label="Full Name" type="text" />
          )}
          <FloatingInput label="Email" type="text" icon={Mail} value={email} onChange={setEmail} />
          <div className="relative">
            <FloatingInput label="Password" type={showPw ? 'text' : 'password'} icon={Lock} value={password} onChange={setPassword} />
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

          {!register && (
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="accent-red-600" /> Remember me
              </label>
              <a href="#" className="hover:text-ink transition-colors">Forgot password?</a>
            </div>
          )}

          <Button variant="primary" size="md" className="w-full mt-2" type="submit">
            {register ? 'Create Account' : 'Log In'}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-ink-soft">or continue with</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm">Google</Button>
          <Button variant="secondary" size="sm">GitHub</Button>
        </div>

        <p className="text-center text-xs text-ink-soft mt-7">
          {register ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={register ? '/login' : '/register'} className="text-primary hover:text-red-400 font-medium">
            {register ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function FloatingInput({ label, type, icon: Icon, value, onChange }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />}
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-bg border border-border rounded-xl py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/50 transition-colors ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
      />
    </div>
  );
}
