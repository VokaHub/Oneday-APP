import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const BottomNav: React.FC = () => {
  const { esCuentaEmprendedor } = useAuth();
  const { currentScreen, setCurrentScreen, navTab, setNavTab } = useNavigation();

  if (currentScreen !== 'principal' && currentScreen !== 'perfil') {
    return null;
  }

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-neutral-900 text-white rounded-full p-1 shadow-lg flex items-center justify-around z-30"
    >
      <button
        type="button"
        onClick={() => {
          setNavTab('inicio');
          setCurrentScreen('principal');
        }}
        className={`flex-1 py-2 px-2 rounded-full text-xs font-medium flex items-center justify-center transition cursor-pointer ${
          currentScreen === 'principal' && navTab === 'inicio'
            ? 'bg-white text-neutral-900 shadow-xs'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <span>Inicio</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setNavTab('actividad');
          setCurrentScreen('principal');
        }}
        className={`flex-1 py-2 px-2 rounded-full text-xs font-medium flex items-center justify-center transition cursor-pointer ${
          currentScreen === 'principal' && navTab === 'actividad'
            ? 'bg-white text-neutral-900 shadow-xs'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <span>Actividad</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setNavTab('favoritos');
          setCurrentScreen('principal');
        }}
        className={`flex-1 py-2 px-2 rounded-full text-xs font-medium flex items-center justify-center transition cursor-pointer ${
          currentScreen === 'principal' && navTab === 'favoritos'
            ? 'bg-white text-neutral-900 shadow-xs'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <span>Favoritos</span>
      </button>

      {esCuentaEmprendedor && (
        <button
          type="button"
          onClick={() => {
            setNavTab('perfil_emprendedor');
            setCurrentScreen('principal');
          }}
          className={`flex-1 py-2 px-2 rounded-full text-xs font-medium flex items-center justify-center transition cursor-pointer ${
            currentScreen === 'principal' && navTab === 'perfil_emprendedor'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Mi perfil</span>
        </button>
      )}
    </nav>
  );
};
