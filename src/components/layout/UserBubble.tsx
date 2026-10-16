import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const UserBubble: React.FC = () => {
  const { authUser, perfilCliente, fotoActual, abrirModalAuth, cerrarSesion } = useAuth();
  const { perfilPopAbierto, setPerfilPopAbierto, perfilPopRef, irAPerfil, irATerminos } = useNavigation();

  return (
    <div ref={perfilPopRef} className="relative">
      <button
        type="button"
        onClick={() => setPerfilPopAbierto(!perfilPopAbierto)}
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-2xs cursor-pointer focus:outline-none overflow-hidden ${
          perfilPopAbierto
            ? 'bg-neutral-900 border-neutral-900 text-white'
            : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-600'
        }`}
        title={authUser ? (perfilCliente?.Nombre || 'Mi cuenta') : 'Iniciar sesión o registrarte'}
      >
        {fotoActual ? (
          <img
            src={fotoActual}
            alt={perfilCliente?.Nombre || 'Perfil'}
            className="w-full h-full object-cover"
          />
        ) : authUser && perfilCliente?.Nombre ? (
          <span className="text-xs font-bold text-neutral-800">
            {perfilCliente.Nombre.charAt(0).toUpperCase()}
          </span>
        ) : (
          <UserIcon size={18} />
        )}
      </button>

      {/* Pop-up esquinero limpio */}
      {perfilPopAbierto && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-3xl p-3 shadow-xl border border-neutral-200 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
          <div className="px-2 pt-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Mi cuenta
            </span>
          </div>

          {!authUser ? (
            <button
              type="button"
              onClick={() => {
                setPerfilPopAbierto(false);
                abrirModalAuth('iniciar_sesion');
              }}
              className="w-full py-2.5 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium text-center transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Iniciar sesión o registrarte</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPerfilPopAbierto(false);
                irAPerfil();
              }}
              className="w-full py-2.5 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium text-center transition cursor-pointer active:scale-98"
            >
              Mi cuenta
            </button>
          )}

          <div className="border-t border-neutral-100 my-1.5" />

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setPerfilPopAbierto(false);
                irATerminos();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-neutral-100 text-xs font-medium text-neutral-800 flex items-center justify-between transition text-left cursor-pointer"
            >
              <span>Términos y condiciones</span>
            </button>

            {authUser && (
              <button
                type="button"
                onClick={async () => {
                  setPerfilPopAbierto(false);
                  await cerrarSesion();
                }}
                className="w-full px-3 py-2 rounded-xl hover:bg-red-50 text-xs font-medium text-red-600 flex items-center justify-between transition text-left cursor-pointer"
              >
                <span>Cerrar sesión</span>
                <LogOut size={13} className="text-red-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
