import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import {
  obtenerEmprendedorPorUid,
  evaluarEstadoPro,
  sincronizarEstadoPro,
  EmprendedorData,
} from '../services/firebaseDataService';
import { PerfilClienteData } from '../types';

interface AuthContextType {
  authUser: User | null;
  perfilCliente: PerfilClienteData | null;
  emprendedorCuenta: EmprendedorData | null;
  authCargando: boolean;
  cargandoEmprendedor: boolean;
  fotoActual: string;
  esEmprendedorAprobado: boolean;
  esProActivo: boolean;
  esCuentaEmprendedor: boolean;
  valorMembresiaPro: string;
  yaTuvoPro: boolean;
  
  // Auth modal controls
  modalAuth: boolean;
  authModo: 'iniciar_sesion' | 'registro';
  errorAuth: string;
  cargandoAuth: boolean;
  abrirModalAuth: (modo?: 'iniciar_sesion' | 'registro') => void;
  cerrarModalAuth: () => void;
  setErrorAuth: (msg: string) => void;
  
  // Client completion modal controls
  modalCompletarPerfil: boolean;
  abrirModalCompletarPerfil: () => void;
  cerrarModalCompletarPerfil: () => void;
  
  // Auth operations
  iniciarSesionEmail: (email: string, pass: string) => Promise<void>;
  registrarEmail: (nombre: string, email: string, pass: string) => Promise<void>;
  iniciarSesionGoogle: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
  guardarPerfilCliente: (perfil: PerfilClienteData) => void;
  setEmprendedorCuenta: React.Dispatch<React.SetStateAction<EmprendedorData | null>>;
  setPerfilCliente: React.Dispatch<React.SetStateAction<PerfilClienteData | null>>;
  recargarEmprendedor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [perfilCliente, setPerfilCliente] = useState<PerfilClienteData | null>(null);
  const [emprendedorCuenta, setEmprendedorCuenta] = useState<EmprendedorData | null>(null);
  const [authCargando, setAuthCargando] = useState<boolean>(true);
  const [cargandoEmprendedor, setCargandoEmprendedor] = useState<boolean>(false);

  // Modales
  const [modalAuth, setModalAuth] = useState<boolean>(false);
  const [authModo, setAuthModo] = useState<'iniciar_sesion' | 'registro'>('iniciar_sesion');
  const [errorAuth, setErrorAuth] = useState<string>('');
  const [cargandoAuth, setCargandoAuth] = useState<boolean>(false);
  const [modalCompletarPerfil, setModalCompletarPerfil] = useState<boolean>(false);

  // Derivados
  const fotoActual = perfilCliente?.Foto || authUser?.photoURL || '';
  const esEmprendedorAprobado = Boolean(
    emprendedorCuenta &&
      (emprendedorCuenta.Estado_Aprobacion?.toLowerCase() === 'aprobado' ||
        emprendedorCuenta.Estado_Aprobacion === 'Aprobado')
  );
  const evalProCuenta = evaluarEstadoPro(emprendedorCuenta);
  const esProActivo =
    evalProCuenta.esPro ||
    ((emprendedorCuenta?.Nivel || (emprendedorCuenta as any)?.nivel || '').toUpperCase().trim() === 'PRO');
  const esCuentaEmprendedor = Boolean(emprendedorCuenta);
  const valorMembresiaPro = (
    emprendedorCuenta?.membresia_pro ||
    emprendedorCuenta?.Membresia_Pro ||
    (emprendedorCuenta as any)?.['membresía pro'] ||
    (emprendedorCuenta as any)?.['Membresía Pro'] ||
    ''
  ).toLowerCase().trim();
  const yaTuvoPro =
    valorMembresiaPro === 'sí' ||
    valorMembresiaPro === 'si' ||
    valorMembresiaPro === 'yes';

  // Escuchar estado de Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setModalAuth(false);
      setCargandoAuth(false);
      setAuthCargando(false);

      setPerfilCliente(null);
      setErrorAuth('');

      if (user) {
        try {
          const docRef = doc(db, 'clientes', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const clienteObj: PerfilClienteData = {
              uid: user.uid,
              ID_cliente: data.ID_cliente || data.ID_Cliente || 'CLI-1001',
              ID_Cliente: data.ID_Cliente || data.ID_cliente || 'CLI-1001',
              nombre: data.nombre || data.Nombre || user.displayName || 'Cliente',
              Nombre: data.Nombre || data.nombre || user.displayName || 'Cliente',
              correo: data.correo || data.Correo || user.email || '',
              Correo: data.Correo || data.correo || user.email || '',
              telefono: data.telefono || data.Telefono || '',
              Telefono: data.Telefono || data.telefono || '',
              foto: data.foto || data.Foto || user.photoURL || '',
              Foto: data.Foto || data.foto || user.photoURL || '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
            setPerfilCliente(clienteObj);

            if (!clienteObj.Telefono) {
              setModalCompletarPerfil(true);
            }
          } else {
            // Usuario con Google nuevo -> completar teléfono
            setModalCompletarPerfil(true);
          }

          // Consultar emprendedor asociado
          try {
            setCargandoEmprendedor(true);
            const empData = await obtenerEmprendedorPorUid(user.uid, user.email || undefined);
            if (empData) {
              setEmprendedorCuenta(empData);
            } else {
              setEmprendedorCuenta(null);
            }
          } catch (eErr) {
            console.warn('Advertencia al consultar emprendedor del usuario:', eErr);
          } finally {
            setCargandoEmprendedor(false);
          }
        } catch (err) {
          console.warn('Advertencia al consultar perfil de cliente en Firestore:', err);
          setModalCompletarPerfil(true);
        }
      } else {
        setPerfilCliente(null);
        setEmprendedorCuenta(null);
        setModalCompletarPerfil(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Monitorear vigencia de OneDay Pro
  useEffect(() => {
    if (!emprendedorCuenta) return;
    const evaluacion = evaluarEstadoPro(emprendedorCuenta);
    if (evaluacion.expirado && authUser) {
      sincronizarEstadoPro(emprendedorCuenta, authUser.uid).then((res) => {
        setEmprendedorCuenta(res.emprendedor);
      });
    }
  }, [emprendedorCuenta, authUser]);

  const abrirModalAuth = (modo: 'iniciar_sesion' | 'registro' = 'iniciar_sesion') => {
    setAuthModo(modo);
    setErrorAuth('');
    setModalAuth(true);
  };

  const cerrarModalAuth = () => {
    setModalAuth(false);
    setCargandoAuth(false);
    setErrorAuth('');
  };

  const abrirModalCompletarPerfil = () => setModalCompletarPerfil(true);
  const cerrarModalCompletarPerfil = () => setModalCompletarPerfil(false);

  const iniciarSesionEmail = async (email: string, pass: string) => {
    setCargandoAuth(true);
    setErrorAuth('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass.trim());
      setModalAuth(false);
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorAuth('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorAuth('No existe una cuenta registrada con este correo.');
      } else {
        setErrorAuth(err.message || 'Error al iniciar sesión.');
      }
      throw err;
    } finally {
      setCargandoAuth(false);
    }
  };

  const registrarEmail = async (nombre: string, email: string, pass: string) => {
    setCargandoAuth(true);
    setErrorAuth('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass.trim());
      if (cred.user && nombre.trim()) {
        await updateProfile(cred.user, { displayName: nombre.trim() });
      }
      setModalAuth(false);
    } catch (err: any) {
      console.error('Error al registrar cuenta:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorAuth('Ya existe una cuenta con este correo.');
      } else if (err.code === 'auth/weak-password') {
        setErrorAuth('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setErrorAuth(err.message || 'Error al crear la cuenta.');
      }
      throw err;
    } finally {
      setCargandoAuth(false);
    }
  };

  const iniciarSesionGoogle = async () => {
    setCargandoAuth(true);
    setErrorAuth('');
    try {
      await signInWithPopup(auth, googleProvider);
      setModalAuth(false);
    } catch (err: any) {
      console.error('Error al iniciar sesión con Google:', err);
      setErrorAuth(err.message || 'No se pudo completar el acceso con Google.');
      throw err;
    } finally {
      setCargandoAuth(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setPerfilCliente(null);
      setEmprendedorCuenta(null);
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  };

  const guardarPerfilCliente = (nuevo: PerfilClienteData) => {
    setPerfilCliente(nuevo);
  };

  const recargarEmprendedor = async () => {
    if (!authUser) return;
    try {
      setCargandoEmprendedor(true);
      const empData = await obtenerEmprendedorPorUid(authUser.uid, authUser.email || undefined);
      setEmprendedorCuenta(empData);
    } finally {
      setCargandoEmprendedor(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        perfilCliente,
        emprendedorCuenta,
        authCargando,
        cargandoEmprendedor,
        fotoActual,
        esEmprendedorAprobado,
        esProActivo,
        esCuentaEmprendedor,
        valorMembresiaPro,
        yaTuvoPro,
        modalAuth,
        authModo,
        errorAuth,
        cargandoAuth,
        abrirModalAuth,
        cerrarModalAuth,
        setErrorAuth,
        modalCompletarPerfil,
        abrirModalCompletarPerfil,
        cerrarModalCompletarPerfil,
        iniciarSesionEmail,
        registrarEmail,
        iniciarSesionGoogle,
        cerrarSesion,
        guardarPerfilCliente,
        setEmprendedorCuenta,
        setPerfilCliente,
        recargarEmprendedor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
