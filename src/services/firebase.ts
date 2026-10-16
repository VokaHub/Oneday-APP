import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Inicializar Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export interface PerfilCliente {
  uid: string;
  id_cliente: string; // ID linkeado oficial (ej. CLI-8392)
  nombre: string;
  correo: string;
  telefono: string;
  alias: string;
  acceso_plataforma: string;
  perfilCompleto: boolean;
}

// Helpers de autenticación
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
};
export type { FirebaseUser };

/**
 * Obtiene o inicializa el perfil del cliente desde localStorage / Firestore
 */
export async function obtenerPerfilCliente(uid: string, correoDefault: string = '', nombreDefault: string = ''): Promise<PerfilCliente> {
  const cacheKey = `oneday_perfil_${uid}`;
  const localData = localStorage.getItem(cacheKey);
  
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (parsed && parsed.uid === uid) {
        return parsed;
      }
    } catch {
      // Ignorar error de parsing
    }
  }

  // Generar ID_Cliente único inicial basado en el UID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const idGenerado = `CLI-${randomSuffix}`;

  const defaultPerfil: PerfilCliente = {
    uid,
    id_cliente: idGenerado,
    nombre: nombreDefault || '',
    correo: correoDefault || '',
    telefono: '',
    alias: nombreDefault ? nombreDefault.split(' ')[0] : '',
    acceso_plataforma: 'Cliente',
    perfilCompleto: false,
  };

  // Intentar leer de Firestore si existe
  try {
    const docRef = doc(db, 'clientes', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as PerfilCliente;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firestore fallback a local/Sheets:', err);
  }

  return defaultPerfil;
}

/**
 * Guarda y actualiza el perfil del cliente en localStorage y Firestore
 */
export async function guardarPerfilCliente(perfil: PerfilCliente): Promise<void> {
  const cacheKey = `oneday_perfil_${perfil.uid}`;
  localStorage.setItem(cacheKey, JSON.stringify(perfil));

  try {
    const docRef = doc(db, 'clientes', perfil.uid);
    await setDoc(docRef, perfil, { merge: true });
  } catch (err) {
    console.warn('No se pudo guardar en Firestore directamente:', err);
  }
}
