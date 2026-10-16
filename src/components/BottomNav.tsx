import React from 'react';

interface BottomNavProps {
  currentScreen: string;
  navTab: 'inicio' | 'actividad' | 'favoritos' | 'perfil_emprendedor' | 'categorias';
  esCuentaEmprendedor: boolean;
  onTabChange: (tab: 'inicio' | 'actividad' | 'favoritos' | 'perfil_emprendedor') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  navTab,
  esCuentaEmprendedor,
  onTabChange,
}) => {
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
        onClick={() => onTabChange('inicio')}
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
        onClick={() => onTabChange('actividad')}
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
        onClick={() => onTabChange('favoritos')}
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
          onClick={() => onTabChange('perfil_emprendedor')}
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

export default BottomNav;
