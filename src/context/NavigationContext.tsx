import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ScreenType, NavTabType, EmprendedorData, ResenaData, CatalogoItemData } from '../types';
import {
  obtenerEmprendedorPorId,
  obtenerResenasEmprendedor,
  obtenerBiografiaDeFirestore,
  obtenerCatalogoEmprendedor,
} from '../services/firebaseDataService';

interface NavigationContextType {
  currentScreen: ScreenType;
  navTab: NavTabType;
  pasoVerificacion: 1 | 2 | 3;
  setCurrentScreen: (screen: ScreenType) => void;
  setNavTab: (tab: NavTabType) => void;
  setPasoVerificacion: (paso: 1 | 2 | 3) => void;
  
  // Popover esquinero
  perfilPopAbierto: boolean;
  setPerfilPopAbierto: React.Dispatch<React.SetStateAction<boolean>>;
  perfilPopRef: React.RefObject<HTMLDivElement | null>;
  
  // Perfil público
  publicoEmprendedor: EmprendedorData | null;
  publicoResenas: ResenaData[];
  publicoProductos: CatalogoItemData[];
  cargandoPerfilPublico: boolean;
  linkCopiado: boolean;
  setPublicoResenas: React.Dispatch<React.SetStateAction<ResenaData[]>>;
  cargarPerfilPublico: (idEmprendedor: string) => Promise<void>;
  handleCopiarLinkPublico: () => Promise<void>;
  handleCopiarLinkPerfil: (idEmprendedor?: string) => Promise<void>;
  
  // Helpers de navegación
  irAInicio: () => void;
  irAPerfil: () => void;
  irAPerfilPublico: (idEmp: string) => void;
  irATerminos: () => void;
  irATerminosImpulso: () => void;
  irAVerificacion: (paso?: 1 | 2 | 3) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('principal');
  const [navTab, setNavTab] = useState<NavTabType>('inicio');
  const [pasoVerificacion, setPasoVerificacion] = useState<1 | 2 | 3>(1);

  // Popover de usuario
  const [perfilPopAbierto, setPerfilPopAbierto] = useState<boolean>(false);
  const perfilPopRef = useRef<HTMLDivElement>(null);

  // Perfil público
  const [publicoEmprendedor, setPublicoEmprendedor] = useState<EmprendedorData | null>(null);
  const [publicoResenas, setPublicoResenas] = useState<ResenaData[]>([]);
  const [publicoProductos, setPublicoProductos] = useState<CatalogoItemData[]>([]);
  const [cargandoPerfilPublico, setCargandoPerfilPublico] = useState<boolean>(false);
  const [linkCopiado, setLinkCopiado] = useState<boolean>(false);

  // Cerrar popover al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (perfilPopRef.current && !perfilPopRef.current.contains(event.target as Node)) {
        setPerfilPopAbierto(false);
      }
    }
    if (perfilPopAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [perfilPopAbierto]);

  // Escuchar parámetros de URL para perfil público
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const perfilIdParam = urlParams.get('perfil') || urlParams.get('p') || urlParams.get('emprendedor');
    if (perfilIdParam) {
      cargarPerfilPublico(perfilIdParam);
    }
  }, []);

  const cargarPerfilPublico = async (idEmprendedor: string) => {
    setCargandoPerfilPublico(true);
    setCurrentScreen('perfil_publico');
    try {
      const emp = await obtenerEmprendedorPorId(idEmprendedor);
      if (emp) {
        const [res, bio, prods] = await Promise.all([
          obtenerResenasEmprendedor(emp.ID_Emprendedor),
          obtenerBiografiaDeFirestore(emp.ID_Emprendedor),
          obtenerCatalogoEmprendedor(emp.ID_Emprendedor),
        ]);
        if (bio) {
          emp.Biografia = bio;
          emp.biografia = bio;
        }
        setPublicoEmprendedor(emp);
        setPublicoResenas(res);
        setPublicoProductos(prods);
      } else {
        setPublicoEmprendedor(null);
        setPublicoResenas([]);
        setPublicoProductos([]);
      }
    } catch (err) {
      console.error('Error al cargar perfil público:', err);
    } finally {
      setCargandoPerfilPublico(false);
    }
  };

  const handleCopiarLinkPublico = async () => {
    if (!publicoEmprendedor?.ID_Emprendedor) return;
    const urlPublica = `${window.location.origin}${window.location.pathname}?perfil=${publicoEmprendedor.ID_Emprendedor}`;
    try {
      await navigator.clipboard.writeText(urlPublica);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2200);
    } catch {
      alert(`Enlace público: ${urlPublica}`);
    }
  };

  const handleCopiarLinkPerfil = async (idEmprendedor?: string) => {
    if (!idEmprendedor) return;
    const urlPublica = `${window.location.origin}${window.location.pathname}?perfil=${idEmprendedor}`;
    try {
      await navigator.clipboard.writeText(urlPublica);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2200);
    } catch {
      alert(`Enlace de perfil: ${urlPublica}`);
    }
  };

  const irAInicio = () => {
    window.history.pushState({}, '', window.location.pathname);
    setPerfilPopAbierto(false);
    setCurrentScreen('principal');
    setNavTab('inicio');
  };

  const irAPerfil = () => {
    setPerfilPopAbierto(false);
    setCurrentScreen('perfil');
  };

  const irAPerfilPublico = (idEmp: string) => {
    cargarPerfilPublico(idEmp);
  };

  const irATerminos = () => {
    setPerfilPopAbierto(false);
    setCurrentScreen('terminos');
  };

  const irATerminosImpulso = () => {
    setCurrentScreen('terminos_impulso');
  };

  const irAVerificacion = (paso: 1 | 2 | 3 = 1) => {
    setPasoVerificacion(paso);
    setCurrentScreen('verificacion');
  };

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        navTab,
        pasoVerificacion,
        setCurrentScreen,
        setNavTab,
        setPasoVerificacion,
        perfilPopAbierto,
        setPerfilPopAbierto,
        perfilPopRef,
        publicoEmprendedor,
        publicoResenas,
        publicoProductos,
        cargandoPerfilPublico,
        linkCopiado,
        setPublicoResenas,
        cargarPerfilPublico,
        handleCopiarLinkPublico,
        handleCopiarLinkPerfil,
        irAInicio,
        irAPerfil,
        irAPerfilPublico,
        irATerminos,
        irATerminosImpulso,
        irAVerificacion,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
