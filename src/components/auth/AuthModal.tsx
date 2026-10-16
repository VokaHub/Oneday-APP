import React, { useState } from 'react';
import { X, AlertCircle, User as UserIcon, Mail, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../common/GoogleIcon';

export const AuthModal: React.FC = () => {
  const {
    modalAuth,
    authModo,
    abrirModalAuth,
    cerrarModalAuth,
    errorAuth,
    setErrorAuth,
    cargandoAuth,
    iniciarSesionEmail,
    registrarEmail,
    iniciarSesionGoogle,
  } = useAuth();

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authNombre, setAuthNombre] = useState('');

  if (!modalAuth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setErrorAuth('Por favor completa todos los campos.');
      return;
    }
    if (authModo === 'registro' && !authNombre.trim()) {
      setErrorAuth('Por favor ingresa tu nombre completo.');
      return;
    }

    try {
      if (authModo === 'iniciar_sesion') {
        await iniciarSesionEmail(authEmail, authPassword);
      } else {
        await registrarEmail(authNombre, authEmail, authPassword);
      }
      setAuthEmail('');
      setAuthPassword('');
      setAuthNombre('');
    } catch {
      // Error is set in context
    }
  };

  const handleGoogle = async () => {
    try {
      await iniciarSesionGoogle();
      setAuthEmail('');
      setAuthPassword('');
      setAuthNombre('');
    } catch {
      // Error is set in context
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
            {authModo === 'iniciar_sesion' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h3>
          <button
            type="button"
            onClick={cerrarModalAuth}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Selector de modo: Iniciar sesión / Registrarse */}
        <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
          <button
            type="button"
            onClick={() => abrirModalAuth('iniciar_sesion')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer text-center ${
              authModo === 'iniciar_sesion'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => abrirModalAuth('registro')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer text-center ${
              authModo === 'registro'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error si ocurre */}
        {errorAuth && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-500" />
            <span className="leading-relaxed">{errorAuth}</span>
          </div>
        )}

        {/* Formulario de Correo y Contraseña */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {authModo === 'registro' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                Nombre completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={authNombre}
                  onChange={(e) => setAuthNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 pl-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                />
                <UserIcon size={14} className="absolute left-3.5 top-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 pl-3">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 pl-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                required
              />
              <Mail size={14} className="absolute left-3.5 top-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 pl-3">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 pl-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                required
                minLength={6}
              />
              <Lock size={14} className="absolute left-3.5 top-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={cargandoAuth}
              className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {cargandoAuth ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{authModo === 'iniciar_sesion' ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
                </>
              ) : (
                <span>{authModo === 'iniciar_sesion' ? 'Iniciar sesión' : 'Crear mi cuenta'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Separador */}
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-2.5 text-[11px] text-neutral-400 absolute">
            o
          </span>
        </div>

        {/* Botón de Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={cargandoAuth}
          className="w-full h-11 rounded-full border border-neutral-300 hover:bg-neutral-50 transition flex items-center justify-center gap-2.5 text-xs font-semibold text-neutral-700 cursor-pointer shadow-2xs active:scale-98"
        >
          <GoogleIcon />
          <span>Continuar con Google</span>
        </button>

        {/* Footer conmutador */}
        <div className="text-center pt-1">
          {authModo === 'iniciar_sesion' ? (
            <p className="text-xs text-neutral-500">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => abrirModalAuth('registro')}
                className="text-neutral-900 font-semibold underline cursor-pointer"
              >
                Regístrate
              </button>
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => abrirModalAuth('iniciar_sesion')}
                className="text-neutral-900 font-semibold underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
