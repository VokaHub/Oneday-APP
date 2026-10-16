import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  X,
  Plus,
  Minus,
  RefreshCw,
  Home,
  Grid,
  AlertCircle,
  MapPin,
  Laptop,
  User as UserIcon,
  FileText,
  LogOut,
  Camera,
  MessageCircle,
  Upload,
  Mail,
  Lock,
  Pencil,
  Phone,
  Star,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  ExternalLink,
  Share2,
  Heart,
  Inbox,
  Activity,
  Gift,
  Briefcase,
  Wallet,
  Store,
  Users,
  ShoppingBag,
  Rocket,
  Headset,
  Instagram,
  Facebook,
} from 'lucide-react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import {
  obtenerServiciosDeEmprendedores,
  crearSolicitudEnFirestore,
  sobrescribirEstadoSolicitud,
  asignarEmprendedorASolicitud,
  solicitarVerificacionEmprendedor,
  obtenerEmprendedorPorUid,
  obtenerEmprendedorPorId,
  guardarResenaEnFirestore,
  obtenerResenasEmprendedor,
  calcularPuntuacionResenas,
  activarOneDayPro,
  evaluarEstadoPro,
  sincronizarEstadoPro,
  consultarSolicitudesCliente,
  consultarTrabajosEmprendedor,
  guardarBiografiaEnFirestore,
  obtenerBiografiaDeFirestore,
  sobrescribirPerfilEmprendedor,
  obtenerMaxItemsCatalogo,
  obtenerCatalogoEmprendedor,
  guardarItemCatalogoEnFirestore,
  eliminarItemCatalogoDeFirestore,
  eliminarTarjetaImpulsoDeCuenta,
  guardarFavoritoEnFirestore,
  eliminarFavoritoDeFirestore,
  obtenerFavoritosDeFirestore,
  suscribirSolicitudEnTiempoReal,
  aceptarSolicitudEmprendedor,
  rechazarSolicitudEmprendedor,
  FavoritoData,
  SolicitudData,
  EmprendedorData,
  ResenaData,
  CatalogoItemData,
} from './services/firebaseDataService';
import { comprimirImagen } from './utils/imageCompressor';
import { GRUPOS_UBICACIONES_GUATEMALA } from './services/guatemalaLocationService';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { MatchingCardCliente } from './components/MatchingCardCliente';
import { MatchingCardEmprendedor } from './components/MatchingCardEmprendedor';
import { BlindMatchingSlideUp } from './components/BlindMatchingSlideUp';
import { ResenasCarrusel } from './components/common/ResenasCarrusel';
import ImpulsoTermsView from './views/ImpulsoTermsView';

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const RANGOS_PRESUPUESTO = [
  'Menos de Q150',
  'Q150 - Q350',
  'Q350 - Q750',
  'Q750 - Q1,500',
  'Q1,500 - Q3,000',
  'Q3,000+',
];

const CATEGORIAS_CONFIG = [
  { id: 'profesionales', nombre: 'Profesionales' },
  { id: 'creativos', nombre: 'Creativos' },
  { id: 'espacios', nombre: 'Espacios' },
  { id: 'marcas', nombre: 'Marcas' },
];

interface PerfilClienteData {
  ID_Cliente: string;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Foto?: string;
  ID_cliente?: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  foto?: string;
}

interface SolicitudEnProceso {
  ID_solicitud: string;
  ID_cliente: string;
  servicio_buscado: string;
  detalles_necesidad: string;
  detalle_necesidad?: string;
  presupuesto: string;
  ubicacion_servicios: string;
  fecha_estimado: string;
  ID_emprendedor_asignado: string;
  emprendedor_asignado: string;
  estado: string;
  ID_Solicitud?: string;
  ID_Cliente?: string;
  Servicio_Buscado?: string;
  Detalles_Necesidad?: string;
  Presupuesto?: string;
  Ubicacion_Servicio?: string;
  Fecha_Estimada?: string;
  Estado?: string;
}

// Insignia oficial tipo Instagram en Verde Lima vibrante (#84cc16) con checkmark blanco
export const LimeVerifiedBadge = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 select-none"
  >
    {/* Roseta estrellada en verde lima */}
    <path
      d="M12 1.8L14.4 4.3L17.7 3.8L18.8 6.9L21.9 8.2L21.3 11.5L23.1 14.3L20.8 16.7L21.2 20L18 20.6L16.2 23.3L13.1 22L10.3 23.6L8.7 20.9L5.4 20.7L5.3 17.4L2.6 15.5L3.8 12.4L1.9 9.8L4.6 8L4.6 4.7L7.9 4.9L10 2.6L12 1.8Z"
      fill="#84cc16"
      stroke="#65a30d"
      strokeWidth="0.5"
    />
    {/* Checkmark blanco interior */}
    <path
      d="M8.2 12.3L10.7 14.8L16 9.3"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Versión de la marca en gris como faltante estilo Instagram
export const GrayVerifiedBadge = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 select-none"
  >
    {/* Roseta en gris */}
    <path
      d="M12 1.8L14.4 4.3L17.7 3.8L18.8 6.9L21.9 8.2L21.3 11.5L23.1 14.3L20.8 16.7L21.2 20L18 20.6L16.2 23.3L13.1 22L10.3 23.6L8.7 20.9L5.4 20.7L5.3 17.4L2.6 15.5L3.8 12.4L1.9 9.8L4.6 8L4.6 4.7L7.9 4.9L10 2.6L12 1.8Z"
      fill="#d1d5db"
      stroke="#9ca3af"
      strokeWidth="0.5"
    />
    {/* Checkmark blanco interior */}
    <path
      d="M8.2 12.3L10.7 14.8L16 9.3"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type ProductoEmprendedor = CatalogoItemData;

export default function App() {
  const [navTab, setNavTab] = useState<'inicio' | 'actividad' | 'favoritos' | 'perfil_emprendedor' | 'categorias'>('inicio');

  // Filtro superior en la pestaña Actividad para cuentas OneDay Pro: 'mis_trabajos' (default) o 'mis_pedidos'
  const [filtroActividad, setFiltroActividad] = useState<'mis_trabajos' | 'mis_pedidos'>('mis_trabajos');
  const [misPedidos, setMisPedidos] = useState<SolicitudData[]>([]);
  const [misTrabajos, setMisTrabajos] = useState<SolicitudData[]>([]);
  const [cargandoActividad, setCargandoActividad] = useState<boolean>(false);
  const [detalleSolicitudActividad, setDetalleSolicitudActividad] = useState<SolicitudData | null>(null);

  // Estados para pull-to-refresh y recarga de Actividad
  const [pullDistancia, setPullDistancia] = useState<number>(0);
  const [estaRecargandoPull, setEstaRecargandoPull] = useState<boolean>(false);
  const touchStartY = useRef<number>(0);
  const actividadContainerRef = useRef<HTMLDivElement>(null);

  // Catálogo de productos para emprendedores Pro (100% basado en Firebase Firestore)
  const [productosEmprendedor, setProductosEmprendedor] = useState<ProductoEmprendedor[]>([]);
  const [guardandoProducto, setGuardandoProducto] = useState<boolean>(false);
  const [tarjetaImpulsoEliminada, setTarjetaImpulsoEliminada] = useState<boolean>(false);
  const [modalNuevoProducto, setModalNuevoProducto] = useState<boolean>(false);
  const [prodNombre, setProdNombre] = useState<string>('');
  const [prodPrecio, setProdPrecio] = useState<string>('');
  const [prodFoto, setProdFoto] = useState<string>('');
  const [prodDescripcion, setProdDescripcion] = useState<string>('');
  const inputFotoProdRef = useRef<HTMLInputElement>(null);

  // Modales interactivos dentro de Mi Cuenta
  const [modalFavoritos, setModalFavoritos] = useState<boolean>(false);
  const [listaFavoritos, setListaFavoritos] = useState<FavoritoData[]>(() => {
    try {
      const guardados = localStorage.getItem('oneday_favoritos');
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });
  const [modalBandeja, setModalBandeja] = useState<boolean>(false);
  const [modalBilletera, setModalBilletera] = useState<boolean>(false);
  const [modalRegalos, setModalRegalos] = useState<boolean>(false);
  const [modalComunidad, setModalComunidad] = useState<boolean>(false);

  // Control del slide-up del formulario principal
  const [isSlideUpOpen, setIsSlideUpOpen] = useState<boolean>(false);

  // Control del slide-up de categorías desde las esferas del inicio
  const [categoriaModalAbierta, setCategoriaModalAbierta] = useState<string | null>(null);

  // Categoría desplegada inline en la pestaña Categorías
  const [categoriaInlineAbierta, setCategoriaInlineAbierta] = useState<string | null>(null);

  // Popover esquinero de perfil tipo Google
  const [perfilPopAbierto, setPerfilPopAbierto] = useState<boolean>(false);

  // Pantallas de la app: 'principal' | 'solicitud_en_proceso' | 'terminos' | 'perfil' | 'perfil_publico' | 'verificacion' | 'terminos_impulso'
  const [currentScreen, setCurrentScreen] = useState<
    'principal' | 'solicitud_en_proceso' | 'terminos' | 'perfil' | 'perfil_publico' | 'verificacion' | 'terminos_impulso'
  >('principal');
  const [pasoVerificacion, setPasoVerificacion] = useState<1 | 2 | 3>(1);
  const [guardandoTerminosImpulso, setGuardandoTerminosImpulso] = useState<boolean>(false);

  // Estado de Emprendedor y Verificación de Cuenta
  const [emprendedorCuenta, setEmprendedorCuenta] = useState<EmprendedorData | null>(null);
  const [resenasEmprendedor, setResenasEmprendedor] = useState<ResenaData[]>([]);
  const [cargandoEmprendedor, setCargandoEmprendedor] = useState<boolean>(false);
  const [modalVerificarEmprendedor, setModalVerificarEmprendedor] = useState<boolean>(false);
  const [linkCopiado, setLinkCopiado] = useState<boolean>(false);
  const [proSlideUpAbierto, setProSlideUpAbierto] = useState<boolean>(false);
  const [actualizandoAPro, setActualizandoAPro] = useState<boolean>(false);
  const [mensajeProExito, setMensajeProExito] = useState<string>('');
  const [errorPro, setErrorPro] = useState<string>('');

  // Formulario de Solicitud de Emprendedor Verificado
  const [empCategoria, setEmpCategoria] = useState<string>('Profesionales');
  const [empServicio, setEmpServicio] = useState<string>('');
  const [sugerenciasEmpServicio, setSugerenciasEmpServicio] = useState<string[]>([]);
  const [mostrarSugerenciasEmp, setMostrarSugerenciasEmp] = useState<boolean>(false);
  const [empModalidad, setEmpModalidad] = useState<string>('Presencial');
  const [empUbicacion, setEmpUbicacion] = useState<string>('');
  const [empRangoPrecios, setEmpRangoPrecios] = useState<string>('');
  const [empDPI, setEmpDPI] = useState<string>('');
  const [empDPIFotoPreview, setEmpDPIFotoPreview] = useState<string>('');
  const [empCV, setEmpCV] = useState<string>('');
  const [empPortafolio, setEmpPortafolio] = useState<string>('');
  const [empColegiado, setEmpColegiado] = useState<string>('');
  const [enviandoSolicitudEmp, setEnviandoSolicitudEmp] = useState<boolean>(false);
  const [errorSolicitudEmp, setErrorSolicitudEmp] = useState<string>('');
  const inputFotoDpiRef = useRef<HTMLInputElement>(null);

  // Estado para la vista de Perfil Público (acceso desde link del navegador)
  const [publicoEmprendedor, setPublicoEmprendedor] = useState<EmprendedorData | null>(null);
  const [publicoResenas, setPublicoResenas] = useState<ResenaData[]>([]);
  const [publicoProductos, setPublicoProductos] = useState<CatalogoItemData[]>([]);
  const [cargandoPerfilPublico, setCargandoPerfilPublico] = useState<boolean>(false);
  const [modalEscribirResena, setModalEscribirResena] = useState<boolean>(false);
  const [formResenaNombre, setFormResenaNombre] = useState<string>('');
  const [formResenaEstrellas, setFormResenaEstrellas] = useState<number>(5);
  const [formResenaComentario, setFormResenaComentario] = useState<string>('');
  const [mensajeResenaExito, setMensajeResenaExito] = useState<string>('');
  const [tipoNombreResena, setTipoNombreResena] = useState<'completo' | 'anonimo'>('completo');
  const [enviandoResena, setEnviandoResena] = useState<boolean>(false);

  // Estados para biografía editable del emprendedor
  const [editandoBio, setEditandoBio] = useState<boolean>(false);
  const [bioTexto, setBioTexto] = useState<string>('');
  const [bioTextoInput, setBioTextoInput] = useState<string>('');
  const [guardandoBio, setGuardandoBio] = useState<boolean>(false);

  // Modal y formulario para "Editar perfil" (estilo Instagram: biografía, ubicación, modalidad, foto)
  const [modalEditarPerfil, setModalEditarPerfil] = useState<boolean>(false);
  const [editPerfilBio, setEditPerfilBio] = useState<string>('');
  const [editPerfilUbicacion, setEditPerfilUbicacion] = useState<string>('');
  const [editPerfilModalidad, setEditPerfilModalidad] = useState<string>('Presencial');
  const [editPerfilFotoPreview, setEditPerfilFotoPreview] = useState<string>('');
  const [editPerfilFotoArchivo, setEditPerfilFotoArchivo] = useState<File | null>(null);
  const [guardandoEdicionPerfil, setGuardandoEdicionPerfil] = useState<boolean>(false);
  const [mensajeExitoEdicion, setMensajeExitoEdicion] = useState<string>('');
  const inputFotoModalEditarRef = useRef<HTMLInputElement>(null);

  // Estado de Autenticación con Firebase
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [perfilCliente, setPerfilCliente] = useState<PerfilClienteData | null>(null);
  const [authCargando, setAuthCargando] = useState<boolean>(true);
  const [iniciandoSesion, setIniciandoSesion] = useState<boolean>(false);

  // Modal para completar perfil obligatorio (Nombre, Correo, Teléfono, Foto, ID_Cliente)
  const [modalCompletarPerfil, setModalCompletarPerfil] = useState<boolean>(false);
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCorreo, setFormCorreo] = useState<string>('');
  const [formTelefono, setFormTelefono] = useState<string>('');
  const [formFotoPreview, setFormFotoPreview] = useState<string>('');
  const [formFotoArchivo, setFormFotoArchivo] = useState<File | null>(null);
  const [guardandoPerfil, setGuardandoPerfil] = useState<boolean>(false);
  const [errorPerfil, setErrorPerfil] = useState<string>('');

  // Modal de Inicio de sesión / Registro (pop-up interno)
  const [modalAuth, setModalAuth] = useState<boolean>(false);
  const [authModo, setAuthModo] = useState<'iniciar_sesion' | 'registro'>('iniciar_sesion');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authNombre, setAuthNombre] = useState<string>('');
  const [errorAuth, setErrorAuth] = useState<string>('');
  const [cargandoAuth, setCargandoAuth] = useState<boolean>(false);

  // Datos leídos de Google Sheets
  const [serviciosDisponibles, setServiciosDisponibles] = useState<string[]>([]);
  const [serviciosPorCategoria, setServiciosPorCategoria] = useState<{ [key: string]: string[] }>({
    profesionales: [],
    creativos: [],
    espacios: [],
    marcas: [],
  });
  const [idsExistentes, setIdsExistentes] = useState<string[]>([]);
  const [idsClientesExistentes, setIdsClientesExistentes] = useState<string[]>([]);

  // Campos del formulario de solicitud
  const [servicioBuscado, setServicioBuscado] = useState<string>('');
  const [detallesNecesidad, setDetallesNecesidad] = useState<string>('');
  const [presupuesto, setPresupuesto] = useState<string>('');
  
  // Ubicación: ¿A dónde necesitamos llegar?
  const [tipoUbicacion, setTipoUbicacion] = useState<'presencial' | 'remoto'>('presencial');
  const [ubicacionTexto, setUbicacionTexto] = useState<string>('');

  const [fechaEstimada, setFechaEstimada] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Sugerencias de servicio del catálogo
  const [sugerenciasServicio, setSugerenciasServicio] = useState<string[]>([]);
  const [mostrarSugerenciasServicio, setMostrarSugerenciasServicio] = useState<boolean>(false);

  const [solicitudCreada, setSolicitudCreada] = useState<SolicitudEnProceso | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);

  const inputServicioRef = useRef<HTMLInputElement>(null);
  const perfilPopRef = useRef<HTMLDivElement>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const fotoPerfilAvatarInputRef = useRef<HTMLInputElement>(null);
  const [actualizandoFoto, setActualizandoFoto] = useState<boolean>(false);
  const [actualizandoEstadoSolicitud, setActualizandoEstadoSolicitud] = useState<boolean>(false);
  const [mensajeSobrescritura, setMensajeSobrescritura] = useState<string>('');

  // 1. Escuchar cambios de estado en Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setModalAuth(false);
      setCargandoAuth(false);

      // Limpiar datos previos para aislar sesiones y no mezclar cuentas distintas
      setPerfilCliente(null);
      setFormNombre('');
      setFormCorreo('');
      setFormTelefono('');
      setFormFotoPreview('');
      setFormFotoArchivo(null);
      setErrorPerfil('');

      if (user) {
        try {
          const docRef = doc(db, 'clientes', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as PerfilClienteData;
            if (data.Nombre && data.Telefono && data.ID_Cliente) {
              setPerfilCliente(data);
              setFormNombre(data.Nombre);
              setFormCorreo(data.Correo || user.email || '');
              const telSoloDigitos = (data.Telefono || '').replace(/^\+502\s*/, '').trim();
              setFormTelefono(telSoloDigitos);
              setFormFotoPreview(data.Foto || user.photoURL || '');
              setModalCompletarPerfil(false);
            } else {
              setFormNombre(data.Nombre || user.displayName || '');
              setFormCorreo(data.Correo || user.email || '');
              const telSoloDigitos = (data.Telefono || '').replace(/^\+502\s*/, '').trim();
              setFormTelefono(telSoloDigitos);
              setFormFotoPreview(data.Foto || user.photoURL || '');
              setModalCompletarPerfil(true);
            }
          } else {
            // Primera vez de este usuario con Google -> pedir completar su número de Guatemala
            setFormNombre(user.displayName || '');
            setFormCorreo(user.email || '');
            setFormTelefono('');
            setFormFotoPreview(user.photoURL || '');
            setModalCompletarPerfil(true);
          }

          // Consultar si este usuario tiene solicitud o perfil de emprendedor
          try {
            setCargandoEmprendedor(true);
            const empData = await obtenerEmprendedorPorUid(user.uid, user.email || undefined);
            if (empData) {
              setEmprendedorCuenta(empData);
              const [resenas, bioFirestore, catalogosFirestore] = await Promise.all([
                obtenerResenasEmprendedor(empData.ID_Emprendedor),
                obtenerBiografiaDeFirestore(empData.ID_Emprendedor),
                obtenerCatalogoEmprendedor(empData.ID_Emprendedor),
              ]);
              setResenasEmprendedor(resenas);
              setProductosEmprendedor(catalogosFirestore);
              if (empData.tarjeta_impulso_eliminada) {
                setTarjetaImpulsoEliminada(true);
              }
              if (bioFirestore) {
                setBioTexto(bioFirestore);
                empData.Biografia = bioFirestore;
                empData.biografia = bioFirestore;
              } else {
                setBioTexto(empData.Biografia || empData.biografia || '');
              }
            } else {
              setEmprendedorCuenta(null);
              setResenasEmprendedor([]);
              setProductosEmprendedor([]);
              setTarjetaImpulsoEliminada(false);
            }
          } catch (eErr) {
            console.warn('Advertencia al consultar emprendedor del usuario:', eErr);
          } finally {
            setCargandoEmprendedor(false);
          }
        } catch (err) {
          console.warn('Advertencia al consultar perfil de cliente en Firestore:', err);
          setFormNombre(user.displayName || '');
          setFormCorreo(user.email || '');
          setFormTelefono('');
          setFormFotoPreview(user.photoURL || '');
          setModalCompletarPerfil(true);
        }
      } else {
        setPerfilCliente(null);
        setEmprendedorCuenta(null);
        setResenasEmprendedor([]);
        setProductosEmprendedor([]);
        setTarjetaImpulsoEliminada(false);
        setModalCompletarPerfil(false);
      }
      setAuthCargando(false);
    });

    // Detectar si el usuario abrió un link de perfil público (ej. ?perfil=EMP-1001)
    const urlParams = new URLSearchParams(window.location.search);
    const perfilIdParam = urlParams.get('perfil') || urlParams.get('p') || urlParams.get('emprendedor');
    if (perfilIdParam) {
      cargarPerfilPublico(perfilIdParam);
    }

    return () => unsubscribe();
  }, []);

  // Monitorear vigencia de OneDay Pro y revertir a básico en Firestore al expirar (31 días + 1 día)
  useEffect(() => {
    if (!emprendedorCuenta) return;
    const evaluacion = evaluarEstadoPro(emprendedorCuenta);
    if (evaluacion.expirado && authUser) {
      sincronizarEstadoPro(emprendedorCuenta, authUser.uid).then((res) => {
        setEmprendedorCuenta(res.emprendedor);
      });
    }
  }, [emprendedorCuenta, authUser]);

  // Sincronizar biografía cuando carga o cambia la cuenta del emprendedor desde la colección 'biografias'
  useEffect(() => {
    if (emprendedorCuenta) {
      obtenerBiografiaDeFirestore(emprendedorCuenta.ID_Emprendedor).then((bio) => {
        if (bio) {
          setBioTexto(bio);
        } else if (emprendedorCuenta.Biografia || emprendedorCuenta.biografia) {
          setBioTexto(emprendedorCuenta.Biografia || emprendedorCuenta.biografia || '');
        }
      });
    }
  }, [emprendedorCuenta]);

  // Guardar biografía en Firestore en la categoría/colección 'biografias' con el ID del emprendedor
  const handleGuardarBio = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authUser || !emprendedorCuenta) return;
    setGuardandoBio(true);
    const bioLimpia = (bioTextoInput || '').trim().slice(0, 150);
    try {
      await guardarBiografiaEnFirestore(emprendedorCuenta.ID_Emprendedor, bioLimpia);
      const docRef = doc(db, 'emprendedores', authUser.uid);
      await setDoc(
        docRef,
        {
          Biografia: bioLimpia,
          biografia: bioLimpia,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setEmprendedorCuenta({
        ...emprendedorCuenta,
        Biografia: bioLimpia,
        biografia: bioLimpia,
      });
      setBioTexto(bioLimpia);
      setEditandoBio(false);
    } catch (err) {
      console.warn('Error al guardar biografía en Firestore:', err);
    } finally {
      setGuardandoBio(false);
    }
  };

  // Abrir modal "Editar perfil" (estilo Instagram)
  const handleAbrirEditarPerfil = () => {
    if (!emprendedorCuenta) return;
    setEditPerfilBio((bioTexto || emprendedorCuenta.Biografia || emprendedorCuenta.biografia || '').slice(0, 150));
    setEditPerfilUbicacion(emprendedorCuenta.Ubicacion || '');
    setEditPerfilModalidad(emprendedorCuenta.Modalidad || 'Presencial');
    setEditPerfilFotoPreview(fotoActual || '');
    setEditPerfilFotoArchivo(null);
    setMensajeExitoEdicion('');
    setModalEditarPerfil(true);
  };

  // Guardar cambios del perfil en Firebase:
  // - Biografía se sobrescribe en 'biografias' con su ID
  // - Lugar de cobertura se sobrescribe en 'emprendedores' con su ID
  // - Modalidad se sobrescribe en 'emprendedores'
  // - Foto se actualiza
  // - Nombre y Servicio permanecen intactos
  const handleGuardarEdicionPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !emprendedorCuenta) return;
    setGuardandoEdicionPerfil(true);
    setMensajeExitoEdicion('');
    try {
      let fotoFinal = editPerfilFotoPreview;
      if (editPerfilFotoArchivo) {
        fotoFinal = await comprimirImagen(editPerfilFotoArchivo, 400, 400, 0.8);
      }

      const bioLimpia = editPerfilBio.trim().slice(0, 150);
      await sobrescribirPerfilEmprendedor(authUser.uid, emprendedorCuenta.ID_Emprendedor, {
        biografia: bioLimpia,
        ubicacion: editPerfilUbicacion,
        modalidad: editPerfilModalidad,
        foto: fotoFinal !== fotoActual ? fotoFinal : undefined,
      });

      // Sobrescribir estado local
      setBioTexto(bioLimpia);
      const empActualizado: EmprendedorData = {
        ...emprendedorCuenta,
        Biografia: bioLimpia,
        biografia: bioLimpia,
        Ubicacion: editPerfilUbicacion.trim(),
        Modalidad: editPerfilModalidad.trim(),
        ...(fotoFinal ? { Foto: fotoFinal } : {}),
      };
      setEmprendedorCuenta(empActualizado);

      if (fotoFinal && perfilCliente) {
        setPerfilCliente({
          ...perfilCliente,
          Foto: fotoFinal,
          foto: fotoFinal,
        });
      }

      setMensajeExitoEdicion('¡Perfil actualizado con éxito!');
      setTimeout(() => {
        setModalEditarPerfil(false);
        setMensajeExitoEdicion('');
      }, 700);
    } catch (err) {
      console.error('Error al guardar edición de perfil:', err);
      alert('Ocurrió un error al guardar los cambios.');
    } finally {
      setGuardandoEdicionPerfil(false);
    }
  };

  // Cargar actividad de solicitudes y trabajos desde Firestore (recarga exclusivamente los datos de la página)
  const cargarActividad = async () => {
    setCargandoActividad(true);
    try {
      const idCliente = perfilCliente?.ID_Cliente || perfilCliente?.ID_cliente || authUser?.uid || '';
      const correo = perfilCliente?.Correo || perfilCliente?.correo || authUser?.email || '';
      const pedidos = await consultarSolicitudesCliente(idCliente, correo);
      setMisPedidos(pedidos);

      if (emprendedorCuenta?.ID_Emprendedor) {
        const trabajos = await consultarTrabajosEmprendedor(
          emprendedorCuenta.ID_Emprendedor,
          emprendedorCuenta.Nombre
        );
        setMisTrabajos(trabajos);
      } else {
        setMisTrabajos([]);
      }
    } catch (err) {
      console.warn('Error al cargar actividad:', err);
    } finally {
      setCargandoActividad(false);
    }
  };

  // Manejadores de gesto "Pull-to-refresh" para recargar al deslizar o hacer scroll hacia arriba en el tope
  const handleTouchStartActividad = (e: React.TouchEvent<HTMLDivElement>) => {
    if (actividadContainerRef.current && actividadContainerRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchMoveActividad = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current <= 0) return;
    if (actividadContainerRef.current && actividadContainerRef.current.scrollTop <= 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      if (diff > 0) {
        const dist = Math.min(85, Math.pow(diff, 0.82));
        setPullDistancia(dist);
      }
    }
  };

  const handleTouchEndActividad = async () => {
    if (pullDistancia >= 38 && !estaRecargandoPull) {
      setEstaRecargandoPull(true);
      setPullDistancia(50);
      try {
        await cargarActividad();
      } finally {
        setTimeout(() => {
          setEstaRecargandoPull(false);
          setPullDistancia(0);
        }, 500);
      }
    } else {
      setPullDistancia(0);
    }
    touchStartY.current = 0;
  };

  const handleWheelActividad = (e: React.WheelEvent<HTMLDivElement>) => {
    if (actividadContainerRef.current && actividadContainerRef.current.scrollTop <= 0 && e.deltaY < -15) {
      if (!estaRecargandoPull && !cargandoActividad) {
        setEstaRecargandoPull(true);
        setPullDistancia(50);
        cargarActividad().finally(() => {
          setTimeout(() => {
            setEstaRecargandoPull(false);
            setPullDistancia(0);
          }, 600);
        });
      }
    }
  };

  // Recarga periódica espaciada (cada 4 horas) o manual cuando el usuario lo active
  useEffect(() => {
    if (navTab !== 'actividad') return;

    cargarActividad();

    // Recargar cada 4 horas
    const intervalo = setInterval(() => {
      cargarActividad();
    }, 4 * 60 * 60 * 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [navTab, authUser, emprendedorCuenta, perfilCliente]);


  // Cargar datos de perfil público desde enlace externo
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

  // Cargar y sincronizar favoritos con Firestore y almacenamiento local
  useEffect(() => {
    const sincronizarFavoritos = async () => {
      try {
        const key = authUser ? `oneday_favoritos_${authUser.uid}` : 'oneday_favoritos';
        const localFavs = localStorage.getItem(key) || localStorage.getItem('oneday_favoritos');
        if (localFavs) {
          setListaFavoritos(JSON.parse(localFavs));
        }

        if (authUser?.uid) {
          const remotos = await obtenerFavoritosDeFirestore(authUser.uid);
          if (remotos && remotos.length > 0) {
            setListaFavoritos(remotos);
            localStorage.setItem(`oneday_favoritos_${authUser.uid}`, JSON.stringify(remotos));
            localStorage.setItem('oneday_favoritos', JSON.stringify(remotos));
          }
        }
      } catch (err) {
        console.warn('Error al sincronizar favoritos:', err);
      }
    };
    sincronizarFavoritos();
  }, [authUser]);

  // Verificar si el emprendedor del perfil público está en favoritos
  const esFavoritoPublico = Boolean(
    publicoEmprendedor &&
    listaFavoritos.some((f) => f.idEmprendedor === publicoEmprendedor.ID_Emprendedor)
  );

  // Guardar o alternar emprendedor en favoritos desde su perfil público
  const handleToggleFavoritoPublico = async () => {
    if (!publicoEmprendedor) return;
    const idEmp = publicoEmprendedor.ID_Emprendedor;
    const yaEsFav = listaFavoritos.some((f) => f.idEmprendedor === idEmp);

    if (yaEsFav) {
      await handleQuitarDeFavoritos(idEmp);
    } else {
      const nuevoFav: FavoritoData = {
        id: `${authUser?.uid || 'guest'}_${idEmp}`,
        userId: authUser?.uid || 'guest',
        idEmprendedor: idEmp,
        nombre: publicoEmprendedor.Nombre,
        servicio: publicoEmprendedor.Servicio,
        ubicacion: publicoEmprendedor.Ubicacion,
        modalidad: publicoEmprendedor.Modalidad || '',
        foto: publicoEmprendedor.Foto || '',
        categoria: publicoEmprendedor.Categoria || '',
        createdAt: new Date().toISOString(),
      };
      const nuevaLista = [nuevoFav, ...listaFavoritos.filter((f) => f.idEmprendedor !== idEmp)];
      setListaFavoritos(nuevaLista);
      try {
        localStorage.setItem('oneday_favoritos', JSON.stringify(nuevaLista));
        if (authUser?.uid) {
          localStorage.setItem(`oneday_favoritos_${authUser.uid}`, JSON.stringify(nuevaLista));
          await guardarFavoritoEnFirestore(authUser.uid, nuevoFav);
        }
      } catch (e) {
        console.warn('Error al guardar favorito:', e);
      }
    }
  };

  // Quitar emprendedor de favoritos
  const handleQuitarDeFavoritos = async (idEmprendedor: string) => {
    const nuevaLista = listaFavoritos.filter((f) => f.idEmprendedor !== idEmprendedor);
    setListaFavoritos(nuevaLista);
    try {
      localStorage.setItem('oneday_favoritos', JSON.stringify(nuevaLista));
      if (authUser?.uid) {
        localStorage.setItem(`oneday_favoritos_${authUser.uid}`, JSON.stringify(nuevaLista));
        await eliminarFavoritoDeFirestore(authUser.uid, idEmprendedor);
      }
    } catch (e) {
      console.warn('Error al eliminar favorito:', e);
    }
  };

  // Copiar link de perfil de emprendedor al portapapeles
  const handleCopiarLinkPerfil = async () => {
    if (!emprendedorCuenta?.ID_Emprendedor) return;
    const urlPublica = `${window.location.origin}${window.location.pathname}?perfil=${emprendedorCuenta.ID_Emprendedor}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlPublica);
      } else {
        const inputTemp = document.createElement('input');
        inputTemp.value = urlPublica;
        document.body.appendChild(inputTemp);
        inputTemp.select();
        document.execCommand('copy');
        document.body.removeChild(inputTemp);
      }
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    } catch (err) {
      console.error('Error al copiar link:', err);
    }
  };

  // Copiar link desde el perfil público oficial
  const handleCopiarLinkPublico = async () => {
    if (!publicoEmprendedor?.ID_Emprendedor) return;
    const urlPublica = `${window.location.origin}${window.location.pathname}?perfil=${publicoEmprendedor.ID_Emprendedor}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlPublica);
      } else {
        const inputTemp = document.createElement('input');
        inputTemp.value = urlPublica;
        document.body.appendChild(inputTemp);
        inputTemp.select();
        document.execCommand('copy');
        document.body.removeChild(inputTemp);
      }
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    } catch (err) {
      console.error('Error al copiar link público:', err);
    }
  };

  // Abrir modal para completar solicitud como emprendedor verificado
  const handleAbrirModalVerificarEmprendedor = () => {
    if (!authUser) {
      setModalAuth(true);
      return;
    }
    setErrorSolicitudEmp('');
    setEmpCategoria('Profesionales');
    setEmpServicio('');
    setSugerenciasEmpServicio([]);
    setMostrarSugerenciasEmp(false);
    setEmpModalidad('Presencial');
    setEmpUbicacion('');
    setEmpRangoPrecios('');
    setEmpDPI('');
    setEmpDPIFotoPreview('');
    setEmpCV('');
    setEmpPortafolio('');
    setEmpColegiado('');
    setModalVerificarEmprendedor(true);
  };

  // Manejar selección de foto del documento de identificación (DPI)
  const handleSeleccionarFotoDPI = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const fotoComprimida = await comprimirImagen(file, 640, 640, 0.7);
        setEmpDPIFotoPreview(fotoComprimida);
        setEmpDPI(fotoComprimida);
      } catch (err) {
        console.warn('Error comprimiendo foto DPI:', err);
      }
    }
  };

  // Enviar formulario de solicitud para convertirse en emprendedor
  const handleEnviarSolicitudEmprendedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    if (!empServicio.trim()) {
      setErrorSolicitudEmp('Por favor ingresa tu profesión, servicio o habilidad.');
      return;
    }
    if (!empUbicacion.trim()) {
      setErrorSolicitudEmp('Por favor ingresa tu ubicación o cobertura.');
      return;
    }
    if (!empRangoPrecios) {
      setErrorSolicitudEmp('Por favor selecciona tu rango de precios.');
      return;
    }

    setEnviandoSolicitudEmp(true);
    setErrorSolicitudEmp('');

    try {
      const nombreFinal = perfilCliente?.Nombre || perfilCliente?.nombre || authUser.displayName || 'Emprendedor';
      const correoFinal = perfilCliente?.Correo || perfilCliente?.correo || authUser.email || '';
      const telefonoFinal = perfilCliente?.Telefono || perfilCliente?.telefono || '';
      const fotoFinal = perfilCliente?.Foto || perfilCliente?.foto || authUser.photoURL || '';

      const resultado = await solicitarVerificacionEmprendedor({
        uid: authUser.uid,
        nombre: nombreFinal,
        correo: correoFinal,
        telefono: telefonoFinal,
        foto: fotoFinal,
        categoria: empCategoria,
        servicio: empServicio,
        ubicacion: empUbicacion,
        modalidad: empModalidad,
        rangoPrecios: empRangoPrecios,
        documentoIdentificacion: empDPI,
        cv: empCV,
        portafolio: empPortafolio,
        numeroColegiadoLicencia: empColegiado,
        idCliente: perfilCliente?.ID_Cliente || perfilCliente?.ID_cliente || '',
      });

      setEmprendedorCuenta(resultado);
      setModalVerificarEmprendedor(false);
      setPasoVerificacion(1);
      setCurrentScreen('perfil');
    } catch (err: any) {
      console.error('Error al enviar solicitud de emprendedor:', err);
      setErrorSolicitudEmp('Hubo un error al enviar tu solicitud. Intenta de nuevo.');
    } finally {
      setEnviandoSolicitudEmp(false);
    }
  };

  // Convertir cuenta de emprendedor a OneDay Pro (vigencia de 31 días más 1 día)
  const handlePasarAOneDayPro = async () => {
    if (!authUser) {
      setModalAuth(true);
      return;
    }

    setErrorPro('');
    setMensajeProExito('');

    // Validación: un cliente no puede pasarse directo a Pro, debe ser emprendedor primero
    if (!emprendedorCuenta) {
      setErrorPro('Para pasar a OneDay Pro debes ser un emprendedor registrado. Si eres cliente, primero solicita tu verificación.');
      return;
    }

    setActualizandoAPro(true);
    try {
      // Identifica cuál es el ID de emprendedor basado en la cuenta y edita la misma fila/documento en Firebase
      // dejando todo igual pero agregando en la columna 'fecha_pro' la fecha exacta en la que se presionó el botón
      const res = await activarOneDayPro(authUser.uid, authUser.email || undefined);
      setEmprendedorCuenta(res.emprendedorActualizado);

      setMensajeProExito('Membresía Pro activada');
      setTimeout(() => {
        setProSlideUpAbierto(false);
        setMensajeProExito('');
      }, 1500);
    } catch (err: any) {
      console.error('Error al actualizar a OneDay Pro en Firestore:', err);
      setErrorPro(err?.message || 'Hubo un error al activar OneDay Pro. Intenta de nuevo.');
    } finally {
      setActualizandoAPro(false);
    }
  };

  // Publicar reseña desde el link del perfil público
  const handlePublicarResena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicoEmprendedor?.ID_Emprendedor) return;

    if (!formResenaNombre.trim()) {
      alert('Por favor ingresa tu nombre.');
      return;
    }
    if (!formResenaComentario.trim()) {
      alert('Por favor escribe tu reseña.');
      return;
    }

    setEnviandoResena(true);
    try {
      const nueva = await guardarResenaEnFirestore(
        publicoEmprendedor.ID_Emprendedor,
        formResenaNombre,
        formResenaEstrellas,
        formResenaComentario
      );

      setPublicoResenas((prev) => [nueva, ...prev]);
      setFormResenaNombre('');
      setFormResenaComentario('');
      setFormResenaEstrellas(5);
      setMensajeResenaExito('Reseña publicada');
      setTimeout(() => {
        setMensajeResenaExito('');
        setModalEscribirResena(false);
      }, 1400);
    } catch (err) {
      console.error('Error publicando reseña en Firestore:', err);
      alert('Hubo un error al guardar tu reseña.');
    } finally {
      setEnviandoResena(false);
    }
  };

  // 2. Cargar servicios dinámicamente desde la base de emprendedores en Firebase Firestore
  const cargarServiciosEmprendedores = async () => {
    try {
      const data = await obtenerServiciosDeEmprendedores();
      if (Array.isArray(data.servicios)) {
        setServiciosDisponibles(data.servicios);
      }
      if (data.serviciosPorCategoria && typeof data.serviciosPorCategoria === 'object') {
        setServiciosPorCategoria({
          profesionales: data.serviciosPorCategoria.profesionales || [],
          creativos: data.serviciosPorCategoria.creativos || [],
          espacios: data.serviciosPorCategoria.espacios || [],
          marcas: data.serviciosPorCategoria.marcas || [],
        });
      }
    } catch (err) {
      console.warn('Error cargando servicios de emprendedores en Firebase:', err);
    }
  };

  useEffect(() => {
    cargarServiciosEmprendedores();
  }, []);

  // 3. Filtrado de sugerencias contra los servicios disponibles
  useEffect(() => {
    if (!servicioBuscado.trim()) {
      setSugerenciasServicio([]);
      return;
    }
    const q = servicioBuscado.toLowerCase().trim();
    const filtrados = serviciosDisponibles.filter((s) => s.toLowerCase().includes(q));
    setSugerenciasServicio(filtrados);
  }, [servicioBuscado, serviciosDisponibles]);

  // Filtrado de sugerencias para profesión, servicio o habilidad en el formulario de solicitud
  useEffect(() => {
    if (!empServicio.trim()) {
      setSugerenciasEmpServicio([]);
      return;
    }
    const q = empServicio.toLowerCase().trim();
    const filtrados = serviciosDisponibles.filter((s) => s.toLowerCase().includes(q));
    setSugerenciasEmpServicio(filtrados);
  }, [empServicio, serviciosDisponibles]);

  // 4. Cerrar popover de perfil al hacer click fuera
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

  // Abrir y cerrar el modal interno de autenticación
  const handleAbrirModalAuth = (modo: 'iniciar_sesion' | 'registro' = 'iniciar_sesion') => {
    setAuthModo(modo);
    setAuthEmail('');
    setAuthPassword('');
    setAuthNombre('');
    setErrorAuth('');
    setPerfilPopAbierto(false);
    setModalAuth(true);
  };

  const handleCerrarModalAuth = () => {
    setModalAuth(false);
    setCargandoAuth(false);
    setErrorAuth('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthNombre('');
  };

  // Función de seguridad para evitar que las promesas de red queden colgadas indefinidamente
  const conLimiteDeTiempo = <T,>(promesa: Promise<T>, ms: number, mensajeTimeout: string): Promise<T> => {
    let timerId: any;
    const temporizador = new Promise<T>((_, reject) => {
      timerId = setTimeout(() => {
        reject(new Error(mensajeTimeout));
      }, ms);
    });
    return Promise.race([promesa, temporizador]).finally(() => {
      clearTimeout(timerId);
    });
  };

  // Autenticación con Correo y Contraseña (Iniciar sesión o Registrarse)
  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAuth('');

    const emailLimpio = authEmail.trim();
    const passLimpio = authPassword;

    if (!emailLimpio) {
      setErrorAuth('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!passLimpio) {
      setErrorAuth('Por favor ingresa tu contraseña.');
      return;
    }
    if (passLimpio.length < 6) {
      setErrorAuth('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargandoAuth(true);
    try {
      if (authModo === 'iniciar_sesion') {
        await conLimiteDeTiempo(
          signInWithEmailAndPassword(auth, emailLimpio, passLimpio),
          30000,
          'El servidor de autenticación tardó en responder. Verifica tu conexión o intenta con Google.'
        );
      } else {
        const userCred = await conLimiteDeTiempo(
          createUserWithEmailAndPassword(auth, emailLimpio, passLimpio),
          30000,
          'El servidor de autenticación tardó en responder. Verifica tu conexión o intenta con Google.'
        );
        if (authNombre.trim() && userCred.user) {
          try {
            await updateProfile(userCred.user, { displayName: authNombre.trim() });
          } catch (pErr) {
            console.warn('No se pudo actualizar el nombre en Firebase:', pErr);
          }
        }
      }
      handleCerrarModalAuth();
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        if (authModo === 'iniciar_sesion') {
          setErrorAuth('Correo o contraseña incorrectos. Si es tu primera vez entrando, pulsa abajo en "Regístrate" para crear tu contraseña.');
        } else {
          setErrorAuth('No se pudo validar el correo o contraseña. Revisa que el correo sea válido.');
        }
      } else if (code === 'auth/email-already-in-use') {
        setErrorAuth('Este correo ya está registrado. Pulsa abajo en "¿Ya tienes cuenta? Iniciar sesión" para ingresar con tu contraseña.');
      } else if (code === 'auth/weak-password') {
        setErrorAuth('La contraseña es muy corta. Debe tener al menos 6 caracteres.');
      } else if (code === 'auth/invalid-email') {
        setErrorAuth('Ingresa un correo electrónico válido (ejemplo: tunombre@gmail.com).');
      } else if (code === 'auth/operation-not-allowed') {
        setErrorAuth('El acceso con Correo y Contraseña está desactivado en Firebase. En Firebase Console ve a Authentication > Sign-in method > Correo electrónico/contraseña y activa "Habilitar".');
      } else if (code === 'auth/network-request-failed') {
        setErrorAuth('Error de conexión a internet. Verifica tu red e intenta de nuevo.');
      } else if (code === 'auth/too-many-requests') {
        setErrorAuth('Demasiados intentos fallidos. Por favor espera un momento o ingresa con Google.');
      } else if (msg) {
        setErrorAuth(msg);
      } else {
        setErrorAuth('Ocurrió un error al autenticar. Por favor intenta de nuevo.');
      }
    } finally {
      setCargandoAuth(false);
    }
  };

  // Autenticación con Google a través de Firebase
  const handleContinuarGoogle = async () => {
    setErrorAuth('');
    setCargandoAuth(true);
    try {
      await signInWithPopup(auth, googleProvider);
      handleCerrarModalAuth();
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // Cierre voluntario de la ventana emergente por parte del usuario
        console.info('Ventana de Google cerrada o cancelada por el usuario.');
        setErrorAuth('Inicio de sesión cancelado. Puedes intentar de nuevo cuando desees.');
      } else {
        console.error('Error al iniciar sesión con Google:', err);
        if (code === 'auth/popup-blocked') {
          setErrorAuth('Tu navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes (pop-ups) en tu navegador e intenta de nuevo.');
        } else if (code === 'auth/unauthorized-domain') {
          const host = window.location.hostname;
          setErrorAuth(`El dominio actual (${host}) no está en la lista de dominios autorizados de Firebase. Agrégalo en Firebase Console > Authentication > Settings > Authorized domains.`);
        } else if (code === 'auth/operation-not-allowed') {
          setErrorAuth('El proveedor Google está inhabilitado en Firebase. Ve a Firebase Console > Authentication > Sign-in method y habilita Google.');
        } else if (code === 'auth/network-request-failed') {
          setErrorAuth('Error de conexión a internet al contactar con Google. Intenta de nuevo.');
        } else if (msg) {
          setErrorAuth(`Error al conectar con Google: ${msg}`);
        } else {
          setErrorAuth('No se pudo completar el inicio de sesión con Google. Puedes probar registrándote con correo y contraseña.');
        }
      }
    } finally {
      setCargandoAuth(false);
    }
  };

  // Cerrar sesión
  const handleCerrarSesion = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      setPerfilCliente(null);
      setFormNombre('');
      setFormCorreo('');
      setFormTelefono('');
      setFormFotoPreview('');
      setFormFotoArchivo(null);
      setErrorPerfil('');
      setPerfilPopAbierto(false);
      setCurrentScreen('principal');
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  };

  // Generar ID_Cliente único de cliente (ej. CLI-1042)
  const generarIDClienteUnico = (): string => {
    let nuevoId = '';
    let intentos = 0;
    const idsSet = new Set(idsClientesExistentes);
    do {
      const rand = Math.floor(1000 + Math.random() * 9000);
      nuevoId = `CLI-${rand}`;
      intentos++;
    } while (idsSet.has(nuevoId) && intentos < 1000);
    return nuevoId;
  };

  // Manejar selección de foto local
  const handleSeleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormFotoArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Actualizar exclusivamente la foto de perfil desde el lapicito (sin mensajes verdes, actualización inmediata)
  const handleActualizarSoloFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!authUser) return;

    const file = e.target.files[0];
    setActualizandoFoto(true);

    try {
      // Comprimir foto en el navegador a tamaño óptimo (~25KB-45KB) para guardado instantáneo en Firestore
      const fotoComprimida = await comprimirImagen(file, 320, 320, 0.75);

      // Actualizar vista previa de inmediato para respuesta visual
      setFormFotoPreview(fotoComprimida);

      // Guardar en Firestore directamente en la colección clientes
      await setDoc(
        doc(db, 'clientes', authUser.uid),
        {
          Foto: fotoComprimida,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Si tiene cuenta de emprendedor, actualizar también en la colección emprendedores
      if (emprendedorCuenta) {
        try {
          await setDoc(
            doc(db, 'emprendedores', authUser.uid),
            {
              Foto: fotoComprimida,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          setEmprendedorCuenta({
            ...emprendedorCuenta,
            Foto: fotoComprimida,
          });
        } catch (errEmp) {
          console.warn('No se pudo sincronizar foto con emprendedores:', errEmp);
        }
      }

      // Actualizar estado local del cliente
      const nuevoPerfil: PerfilClienteData = perfilCliente
        ? { ...perfilCliente, Foto: fotoComprimida }
        : {
            ID_Cliente: 'CLI-1001',
            Nombre: authUser.displayName || 'Cliente',
            Correo: authUser.email || '',
            Telefono: '',
            Foto: fotoComprimida,
          };
      setPerfilCliente(nuevoPerfil);
    } catch (err: any) {
      console.error('Error al actualizar la foto de perfil en Firestore:', err);
    } finally {
      setActualizandoFoto(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Guardar perfil completado por el cliente en Firestore
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    if (!formNombre.trim()) {
      setErrorPerfil('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formCorreo.trim()) {
      setErrorPerfil('Por favor ingresa tu correo electrónico.');
      return;
    }
    
    // Validar teléfono (+502)
    const digitosTel = formTelefono.trim().replace(/^\+502\s*/, '').replace(/[^0-9]/g, '');
    if (digitosTel.length < 8) {
      setErrorPerfil('Ingresa tu número de teléfono de 8 dígitos (ej. 5555 1234).');
      return;
    }
    const telefonoFinal = `+502 ${digitosTel}`;

    setGuardandoPerfil(true);
    setErrorPerfil('');

    try {
      const esMismoCliente = perfilCliente && perfilCliente.ID_Cliente && (perfilCliente.Correo.toLowerCase() === formCorreo.trim().toLowerCase());
      const idClienteFinal = esMismoCliente ? perfilCliente.ID_Cliente : generarIDClienteUnico();

      // Comprimir foto optimizada para Firestore
      let urlFotoFinal = formFotoPreview || '';
      if (formFotoArchivo) {
        try {
          urlFotoFinal = await comprimirImagen(formFotoArchivo, 320, 320, 0.75);
        } catch (cErr) {
          console.warn('Advertencia al comprimir foto:', cErr);
        }
      }

      const perfilData: PerfilClienteData = {
        ID_cliente: idClienteFinal,
        nombre: formNombre.trim(),
        correo: formCorreo.trim(),
        telefono: telefonoFinal,
        foto: urlFotoFinal,
        ID_Cliente: idClienteFinal,
        Nombre: formNombre.trim(),
        Correo: formCorreo.trim(),
        Telefono: telefonoFinal,
        Foto: urlFotoFinal,
      };

      // Guardar directamente en Firestore en la colección 'clientes'
      try {
        await setDoc(
          doc(db, 'clientes', authUser.uid),
          {
            uid: authUser.uid,
            ID_cliente: idClienteFinal,
            nombre: formNombre.trim(),
            correo: formCorreo.trim(),
            telefono: telefonoFinal,
            foto: urlFotoFinal,
            ID_Cliente: idClienteFinal,
            Nombre: formNombre.trim(),
            Correo: formCorreo.trim(),
            Telefono: telefonoFinal,
            Foto: urlFotoFinal,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, `clientes/${authUser.uid}`);
      }

      setIdsClientesExistentes((prev) => [...prev, idClienteFinal]);
      setPerfilCliente(perfilData);
      setModalCompletarPerfil(false);
    } catch (err: any) {
      console.error('Error al guardar el perfil del cliente:', err);
      setErrorPerfil('Hubo un error al guardar tu perfil. Intenta de nuevo.');
    } finally {
      setGuardandoPerfil(false);
    }
  };


  const abrirSlideUp = (servicioPreseleccionado?: string) => {
    cargarServiciosEmprendedores();
    if (servicioPreseleccionado) {
      setServicioBuscado(servicioPreseleccionado);
    }
    setCategoriaModalAbierta(null);
    setIsSlideUpOpen(true);
  };

  const cerrarSlideUp = () => {
    setIsSlideUpOpen(false);
  };

  const abrirCategoriaSlideUp = (catId: string) => {
    setCategoriaModalAbierta(catId);
  };

  const cerrarCategoriaSlideUp = () => {
    setCategoriaModalAbierta(null);
  };

  const handleToggleCategoriaInline = (catId: string) => {
    if (categoriaInlineAbierta === catId) {
      setCategoriaInlineAbierta(null);
    } else {
      setCategoriaInlineAbierta(catId);
    }
  };

  const seleccionarTagServicio = (servicio: string) => {
    setServicioBuscado(servicio);
    setCategoriaModalAbierta(null);
    setIsSlideUpOpen(true);
  };

  const seleccionarTipoUbicacion = (tipo: 'presencial' | 'remoto') => {
    setTipoUbicacion(tipo);
    if (tipo === 'remoto') {
      setUbicacionTexto('Remoto');
    } else {
      if (ubicacionTexto === 'Remoto') {
        setUbicacionTexto('');
      }
    }
  };

  const generarIDSolicitudUnico = (): string => {
    let nuevoId = '';
    let intentos = 0;
    const idsSet = new Set(idsExistentes);
    do {
      nuevoId = String(Math.floor(10000 + Math.random() * 90000));
      intentos++;
    } while (idsSet.has(nuevoId) && intentos < 1000);
    return nuevoId;
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serviciosDisponibles.length > 0 && !servicioBuscado.trim()) {
      alert('Por favor selecciona un servicio.');
      return;
    }

    if (!detallesNecesidad.trim()) {
      alert('Por favor describe tu necesidad.');
      return;
    }

    if (!presupuesto) {
      alert('Por favor selecciona un presupuesto estimado.');
      return;
    }

    if (!ubicacionTexto.trim()) {
      alert('Por favor indica la dirección o si es remoto.');
      return;
    }

    setEnviando(true);

    const idClienteParaSolicitud = perfilCliente?.ID_cliente || perfilCliente?.ID_Cliente || 'CLI-1001';
    const idFinal = generarIDSolicitudUnico();
    const servicioFinal = servicioBuscado.trim() || 'Servicio general';

    try {
      const nuevaSolicitud: SolicitudData = {
        ID_solicitud: idFinal,
        ID_cliente: idClienteParaSolicitud,
        servicio_buscado: servicioFinal,
        detalles_necesidad: detallesNecesidad.trim(),
        detalle_necesidad: detallesNecesidad.trim(),
        presupuesto: presupuesto,
        ubicacion_servicios: ubicacionTexto.trim(),
        fecha_estimado: fechaEstimada,
        ID_emprendedor_asignado: '',
        emprendedor_asignado: '',
        estado: 'Pendiente',
        cliente_nombre: perfilCliente?.Nombre || perfilCliente?.nombre || authUser?.displayName || 'Cliente',
        cliente_telefono: perfilCliente?.Telefono || perfilCliente?.telefono || '',
        cliente_correo: perfilCliente?.Correo || perfilCliente?.correo || authUser?.email || '',
        createdAt: new Date().toISOString(),
      };

      await crearSolicitudEnFirestore(nuevaSolicitud);
      const objetoCreado: SolicitudData = {
        ID_solicitud: idFinal,
        ID_cliente: idClienteParaSolicitud,
        servicio_buscado: servicioBuscado.trim(),
        detalles_necesidad: detallesNecesidad.trim(),
        detalle_necesidad: detallesNecesidad.trim(),
        presupuesto: presupuesto,
        ubicacion_servicios: ubicacionTexto.trim(),
        fecha_estimado: fechaEstimada,
        ID_emprendedor_asignado: '',
        emprendedor_asignado: '',
        estado: 'Pendiente',
        ID_Solicitud: idFinal,
        ID_Cliente: idClienteParaSolicitud,
        Servicio_Buscado: servicioBuscado.trim(),
        Detalles_Necesidad: detallesNecesidad.trim(),
        Presupuesto: presupuesto,
        Ubicacion_Servicio: ubicacionTexto.trim(),
        Fecha_Estimada: fechaEstimada,
        Estado: 'Pendiente',
      };

      setSolicitudCreada(objetoCreado);
      setMisPedidos((prev) => [objetoCreado, ...prev.filter((p) => (p.ID_solicitud || p.ID_Solicitud) !== idFinal)]);

      setIsSlideUpOpen(false);
      setCurrentScreen('solicitud_en_proceso');
    } catch (err) {
      console.error('Error registrando solicitud en Firestore:', err);
      alert('Hubo un error al enviar tu solicitud. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // Función para sobrescribir información en la misma fila/documento de Firestore al presionar un botón
  const handleCambiarEstadoSolicitud = async (nuevoEstado: 'Pendiente' | 'Activo' | 'En proceso' | 'Completado') => {
    if (!solicitudCreada) return;
    const idSol = solicitudCreada.ID_solicitud || solicitudCreada.ID_Solicitud;
    if (!idSol) return;

    setActualizandoEstadoSolicitud(true);
    try {
      await sobrescribirEstadoSolicitud(idSol, nuevoEstado);
      setSolicitudCreada((prev) => (prev ? {
        ...prev,
        estado: nuevoEstado,
        Estado: nuevoEstado,
      } : null));
      setMensajeSobrescritura(`¡Información sobrescrita con éxito en la misma fila de Firestore! Estado cambiado a: ${nuevoEstado}`);
      setTimeout(() => setMensajeSobrescritura(''), 5000);
    } catch (err) {
      console.error('Error sobrescribiendo estado en Firestore:', err);
    } finally {
      setActualizandoEstadoSolicitud(false);
    }
  };

  const reiniciar = () => {
    setServicioBuscado('');
    setDetallesNecesidad('');
    setPresupuesto('');
    setUbicacionTexto('');
    setTipoUbicacion('presencial');
    setCategoriaModalAbierta(null);
    setCategoriaInlineAbierta(null);
    setPerfilPopAbierto(false);
    setCurrentScreen('principal');
  };

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
  const esPublicoPro = Boolean(
    publicoEmprendedor &&
      (evaluarEstadoPro(publicoEmprendedor).esPro ||
        ((publicoEmprendedor.Nivel || (publicoEmprendedor as any).nivel || '').toUpperCase().trim() === 'PRO'))
  );
  const esCuentaEmprendedor = Boolean(emprendedorCuenta);
  const valorMembresiaPro = (
    emprendedorCuenta?.membresia_pro ||
    emprendedorCuenta?.Membresia_Pro ||
    (emprendedorCuenta as any)?.['membresía pro'] ||
    (emprendedorCuenta as any)?.['Membresía Pro'] ||
    (perfilCliente as any)?.membresia_pro ||
    (perfilCliente as any)?.Membresia_Pro ||
    (perfilCliente as any)?.['membresía pro'] ||
    (perfilCliente as any)?.['Membresía Pro'] ||
    ''
  ).toLowerCase().trim();
  const yaTuvoPro =
    valorMembresiaPro === 'sí' ||
    valorMembresiaPro === 'si' ||
    valorMembresiaPro === 'yes';

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNombre.trim() || !prodPrecio.trim()) return;
    if (!emprendedorCuenta?.ID_Emprendedor) return;

    const maxItems = obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria);
    if (productosEmprendedor.length >= maxItems) {
      alert(`Has alcanzado el límite máximo de ${maxItems} productos para tu categoría.`);
      return;
    }

    setGuardandoProducto(true);
    try {
      const idItemGenerado = `ITEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const precioNormalizado = prodPrecio.trim().startsWith('Q')
        ? prodPrecio.trim()
        : `Q ${prodPrecio.trim()}`;

      const nuevo = await guardarItemCatalogoEnFirestore(
        emprendedorCuenta.ID_Emprendedor,
        {
          idItem: idItemGenerado,
          nombre: prodNombre.trim(),
          precio: precioNormalizado,
          foto: prodFoto,
          descripcion: prodDescripcion.trim(),
        }
      );

      setProductosEmprendedor((prev) => [nuevo, ...prev.filter((p) => (p.idItem || p.id) !== idItemGenerado)]);
      setProdNombre('');
      setProdPrecio('');
      setProdFoto('');
      setProdDescripcion('');
      setModalNuevoProducto(false);
    } catch (err) {
      console.error('Error al guardar ítem de catálogo en Firestore:', err);
      alert('Hubo un error al guardar el producto en el catálogo.');
    } finally {
      setGuardandoProducto(false);
    }
  };

  const handleEliminarProducto = async (idProd?: string) => {
    if (!idProd) return;
    try {
      await eliminarItemCatalogoDeFirestore(idProd);
      setProductosEmprendedor((prev) =>
        prev.filter((p) => p.id !== idProd && p.idItem !== idProd)
      );
    } catch (err) {
      console.error('Error al eliminar producto en Firestore:', err);
      setProductosEmprendedor((prev) =>
        prev.filter((p) => p.id !== idProd && p.idItem !== idProd)
      );
    }
  };

  const handleAceptarTerminosImpulso = async () => {
    if (!authUser) return;
    setGuardandoTerminosImpulso(true);
    try {
      await eliminarTarjetaImpulsoDeCuenta(authUser.uid);
      if (emprendedorCuenta?.ID_Emprendedor) {
        await eliminarTarjetaImpulsoDeCuenta(emprendedorCuenta.ID_Emprendedor);
      }
      setTarjetaImpulsoEliminada(true);
      if (emprendedorCuenta) {
        setEmprendedorCuenta({
          ...emprendedorCuenta,
          tarjeta_impulso_eliminada: true,
        });
      }
      setNavTab('perfil_emprendedor');
      setCurrentScreen('principal');
    } catch (err) {
      console.error('Error al registrar aceptación de términos de impulso:', err);
      setTarjetaImpulsoEliminada(true);
      setNavTab('perfil_emprendedor');
      setCurrentScreen('principal');
    } finally {
      setGuardandoTerminosImpulso(false);
    }
  };

  const obtenerNombreYApellido = (nombreCompleto?: string | null): string => {
    if (!nombreCompleto) return 'Cliente';
    const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return 'Cliente';
    if (partes.length === 1) return partes[0];
    if (partes.length === 2) return `${partes[0]} ${partes[1]}`;

    // En Guatemala el formato estándar oficial (DPI) al pedir nombre completo es:
    // [Primer Nombre] [Segundo Nombre] [Primer Apellido] [Segundo Apellido] (4 palabras)
    if (partes.length === 4) {
      const primerNombre = partes[0];
      // Si el primer apellido es compuesto con partícula (ej. Juan Pedro de León Morales)
      if (partes[2].toLowerCase() === 'de' || partes[2].toLowerCase() === 'del') {
        return `${primerNombre} ${partes[2]} ${partes[3]}`;
      }
      const primerApellido = partes[2];
      return `${primerNombre} ${primerApellido}`;
    }

    // Si son 5 palabras (ej. Luis Fernando de León Castillo)
    if (partes.length >= 5) {
      const primerNombre = partes[0];
      if (partes[2].toLowerCase() === 'de' || partes[2].toLowerCase() === 'del') {
        return `${primerNombre} ${partes[2]} ${partes[3]}`;
      }
      return `${primerNombre} ${partes[2]}`;
    }

    // Si son 3 palabras:
    // Caso A: [Nombre 1] [Nombre 2] [Apellido] (ej. Juan Carlos Gómez, Ana María Castillo)
    // Caso B: [Nombre 1] [Apellido 1] [Apellido 2] (ej. Carlos Gómez Pérez)
    const nombresMediosComunes = new Set([
      'maría', 'maria', 'josé', 'jose', 'carlos', 'fernando', 'francisco', 'alexander',
      'eduardo', 'david', 'manuel', 'antonio', 'alberto', 'roberto', 'alejandro', 'andrés',
      'andres', 'daniel', 'gabriel', 'esteban', 'javier', 'ignacio', 'guillermo', 'enrique',
      'rene', 'rené', 'arturo', 'miguel', 'angel', 'ángel', 'luis', 'pedro', 'pablo', 'juan',
      'paola', 'patricia', 'beatriz', 'elena', 'victoria', 'carmen', 'rosa', 'cristina',
      'isabel', 'fernanda', 'lucía', 'lucia', 'sofía', 'sofia', 'elizabeth', 'guadalupe'
    ]);

    const segundoTermino = partes[1].toLowerCase();
    if (nombresMediosComunes.has(segundoTermino)) {
      // Es [Nombre 1] [Nombre 2] [Apellido] -> Tomamos Nombre 1 y Apellido (palabra 3)
      return `${partes[0]} ${partes[2]}`;
    }

    // Si no es nombre común, es [Nombre 1] [Apellido 1] [Apellido 2] -> Tomamos palabra 1 y 2
    return `${partes[0]} ${partes[1]}`;
  };

  // Formatear lo que es y su ubicación de manera psicológica y limpia (ej. "Psicólogo en Zona 4")
  const obtenerTextoServicioLimpio = (servicio?: string, ubicacion?: string, modalidad?: string) => {
    if (!servicio || !servicio.trim()) return 'Emprendedor verificado';
    let servLimpio = servicio.trim();
    servLimpio = servLimpio.charAt(0).toUpperCase() + servLimpio.slice(1);

    let res = servLimpio;
    if (ubicacion && ubicacion.trim()) {
      const ubi = ubicacion.trim();
      if (ubi.toLowerCase().startsWith('en ')) {
        res += ` ${ubi}`;
      } else {
        res += ` en ${ubi}`;
      }
    }
    if (modalidad && modalidad.trim() && modalidad.toLowerCase() !== 'presencial' && modalidad.toLowerCase() !== 'ambas') {
      res += ` • ${modalidad.trim()}`;
    }
    return res;
  };

  const todosLosPedidos = (() => {
    const lista = [...misPedidos];
    if (solicitudCreada) {
      const idSol = solicitudCreada.ID_solicitud || solicitudCreada.ID_Solicitud;
      if (!lista.some((p) => (p.ID_solicitud || p.ID_Solicitud) === idSol)) {
        lista.unshift(solicitudCreada);
      }
    }
    return lista;
  })();

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex flex-col items-center justify-start text-neutral-900 font-sans selection:bg-neutral-200">
      <main className="w-full max-w-md min-h-screen bg-white flex flex-col justify-start p-4 sm:p-5 pb-24 shadow-xs border-x border-neutral-200 relative">
        {currentScreen === 'principal' ? (
          navTab === 'actividad' ? (
            /* ============================================================== */
            /* PESTAÑA: ACTIVIDAD CON FILTRO SWITCH MIS TRABAJOS / MIS PEDIDOS */
            /* ============================================================== */
            <div
              ref={actividadContainerRef}
              onTouchStart={handleTouchStartActividad}
              onTouchMove={handleTouchMoveActividad}
              onTouchEnd={handleTouchEndActividad}
              onWheel={handleWheelActividad}
              className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150 overflow-y-auto"
            >
              {/* Cabecera Actividad limpia */}
              <div className="pt-2 pb-3 border-b border-neutral-100">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Actividad
                </h2>
              </div>

              {/* Circulito minimalista de recarga (sin pastilla, sin texto) */}
              <div
                style={{
                  height: pullDistancia > 0 ? `${pullDistancia}px` : estaRecargandoPull ? '36px' : '0px',
                  opacity: pullDistancia > 8 || estaRecargandoPull ? 1 : 0,
                }}
                className="overflow-hidden transition-all duration-150 flex items-center justify-center shrink-0"
              >
                <div className="py-2 flex items-center justify-center">
                  <RefreshCw
                    size={18}
                    className={`text-neutral-500 transition-transform ${
                      estaRecargandoPull ? 'animate-spin text-neutral-800' : ''
                    }`}
                    style={{
                      transform: !estaRecargandoPull ? `rotate(${pullDistancia * 6}deg)` : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Si la cuenta es Emprendedor PRO: Switch "mis trabajos", "mis solicitudes" */}
              {esProActivo && (
                <div className="pt-3 pb-1">
                  <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200/80 w-full shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFiltroActividad('mis_trabajos')}
                      className={`flex-1 py-2 rounded-full text-xs font-semibold transition cursor-pointer text-center ${
                        filtroActividad === 'mis_trabajos'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      Mis trabajos
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroActividad('mis_pedidos')}
                      className={`flex-1 py-2 rounded-full text-xs font-semibold transition cursor-pointer text-center ${
                        filtroActividad === 'mis_pedidos'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      Mis solicitudes
                    </button>
                  </div>
                </div>
              )}

              {/* Contenido según filtro (o directo para cliente/básico), centrado en medio si está vacío igual que favoritos */}
              <div className={`flex-1 flex flex-col ${
                (esProActivo && filtroActividad === 'mis_trabajos' && misTrabajos.length === 0) ||
                ((!esProActivo || filtroActividad !== 'mis_trabajos') && todosLosPedidos.length === 0)
                  ? 'justify-center items-center py-10'
                  : 'justify-start pt-3 space-y-3'
              }`}>
                {esProActivo && filtroActividad === 'mis_trabajos' ? (
                  /* ================= VISTA: MIS TRABAJOS (PRO) ================= */
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Mis trabajos
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        OneDay Pro
                      </span>
                    </div>

                    {cargandoActividad && misTrabajos.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
                        <RefreshCw size={22} className="animate-spin text-neutral-400" />
                        <p className="text-xs text-neutral-500">Cargando tus trabajos asignados...</p>
                      </div>
                    ) : misTrabajos.length > 0 ? (
                      <div className="space-y-3">
                        {misTrabajos.map((trabajo, idx) => (
                          <MatchingCardEmprendedor
                            key={trabajo.ID_solicitud || trabajo.ID_Solicitud || `TRAB-${idx}`}
                            solicitud={trabajo}
                            miIdEmprendedor={emprendedorCuenta?.ID_Emprendedor || ''}
                            miNombre={emprendedorCuenta?.Nombre || ''}
                            onChatClick={() => console.log('Chat placeholder')}
                            onEstadoCambio={(idS, nuevoE) => {
                              setMisTrabajos((prev) =>
                                prev.map((t) =>
                                  ((t.ID_solicitud || t.ID_Solicitud) === idS
                                    ? { ...t, estado: nuevoE, Estado: nuevoE }
                                    : t)
                                )
                              );
                              if (nuevoE === 'Rechazado') {
                                setTimeout(() => cargarActividad(), 800);
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-16 px-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                          <Briefcase size={26} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-neutral-900">
                            Sin trabajos asignados
                          </h3>
                          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                            Aquí verás las solicitudes asignadas a tu perfil como emprendedor Pro de {emprendedorCuenta?.Servicio || 'servicios'}.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ================= VISTA: MIS SOLICITUDES (CLIENTE, BÁSICO O PRO) ================= */
                  <div className="w-full flex-1 flex flex-col">
                    {todosLosPedidos.length > 0 && (
                      <div className="flex items-center justify-between px-1 pb-3">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          Mis solicitudes
                        </span>
                        <button
                          type="button"
                          onClick={() => abrirSlideUp()}
                          className="text-xs font-semibold text-neutral-900 underline cursor-pointer"
                        >
                          + Nueva solicitud
                        </button>
                      </div>
                    )}

                    {cargandoActividad && todosLosPedidos.length === 0 ? (
                      <div className="flex-1 py-20 flex flex-col items-center justify-center text-center space-y-2">
                        <RefreshCw size={22} className="animate-spin text-neutral-400" />
                        <p className="text-xs text-neutral-500">Cargando tus solicitudes...</p>
                      </div>
                    ) : todosLosPedidos.length > 0 ? (
                      <div className="space-y-3">
                        {todosLosPedidos.map((sol, idx) => {
                          const idSol = sol.ID_solicitud || sol.ID_Solicitud || `SOL-${idx}`;
                          const serv = sol.servicio_buscado || sol.Servicio_Buscado || 'Servicio solicitado';
                          const est = sol.estado || sol.Estado || 'Pendiente';
                          const pres = sol.presupuesto || sol.Presupuesto || '';
                          const ubi = sol.ubicacion_servicios || sol.Ubicacion_Servicio || '';
                          const fecha = sol.fecha_estimado || sol.Fecha_Estimada || '';
                          const emp = sol.emprendedor_asignado || '';

                          return (
                            <div
                              key={idSol}
                              className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2.5 hover:border-neutral-300 transition shadow-2xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-neutral-400 block">
                                    #{idSol}
                                  </span>
                                  <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                                    {serv}
                                  </h4>
                                </div>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 border ${
                                    est === 'Activo'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : est === 'En proceso'
                                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                                      : est === 'Completado'
                                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                                      : 'bg-amber-100 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  {est}
                                </span>
                              </div>

                              {(sol.detalles_necesidad || sol.Detalles_Necesidad) && (
                                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-neutral-200/60">
                                  {sol.detalles_necesidad || sol.Detalles_Necesidad}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-0.5">
                                {pres && (
                                  <span>
                                    Presupuesto: <strong className="text-neutral-800">{pres}</strong>
                                  </span>
                                )}
                                {ubi && <span>• {ubi}</span>}
                                {fecha && <span>• Para: {fecha}</span>}
                              </div>

                              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                                <span className="text-neutral-500 text-[11px]">
                                  Emprendedor:{' '}
                                  <strong className="text-neutral-800 font-semibold">
                                    {emp || 'En coordinación'}
                                  </strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setDetalleSolicitudActividad(sol)}
                                  className="font-semibold text-neutral-900 underline cursor-pointer"
                                >
                                  Ver detalles
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Estado vacío centrado en medio de la página (igual que Favoritos) */
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8 px-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                          <Inbox size={26} className="text-neutral-400" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-neutral-900">
                            No tienes solicitudes activas
                          </h3>
                          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                            ¿Qué necesitas hoy? Solicita un servicio y conectaremos tu solicitud con emprendedores en Guatemala.
                          </p>
                        </div>
                        <div className="pt-2 w-full max-w-xs">
                          <button
                            type="button"
                            onClick={() => abrirSlideUp()}
                            className="w-full py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Search size={14} />
                            <span>Buscar un emprendedor</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : navTab === 'favoritos' ? (
            /* ============================================================== */
            /* PESTAÑA: FAVORITOS                                             */
            /* ============================================================== */
            <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
              <div className="pt-2 pb-3 flex items-center justify-between border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-neutral-900 fill-neutral-900" />
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Favoritos
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!authUser) {
                      handleAbrirModalAuth('iniciar_sesion');
                    } else {
                      setCurrentScreen('perfil');
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 transition cursor-pointer overflow-hidden shadow-2xs"
                  title="Mi cuenta"
                >
                  {fotoActual ? (
                    <img src={fotoActual} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </button>
              </div>

              {/* Lista de Favoritos o Estado Vacío */}
              {listaFavoritos.length > 0 ? (
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Guardados ({listaFavoritos.length})
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {listaFavoritos.map((fav) => (
                      <div
                        key={fav.idEmprendedor}
                        onClick={() => cargarPerfilPublico(fav.idEmprendedor)}
                        className="w-full bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/90 rounded-2xl p-3.5 transition flex items-center justify-between gap-3 cursor-pointer group shadow-2xs active:scale-[0.99]"
                        title={`Ver perfil de ${fav.nombre}`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Foto o inicial */}
                          <div className="w-12 h-12 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                            {fav.foto ? (
                              <img
                                src={fav.foto}
                                alt={fav.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-neutral-700">
                                {fav.nombre.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Datos del emprendedor */}
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-neutral-900 truncate">
                                {fav.nombre}
                              </h4>
                              <LimeVerifiedBadge size={14} />
                            </div>
                            <p className="text-[11px] text-neutral-600 truncate font-medium">
                              {fav.servicio}
                            </p>
                            {fav.ubicacion && (
                              <p className="text-[10px] text-neutral-400 truncate">
                                {fav.ubicacion}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botón quitar de favoritos y flecha indicadora */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuitarDeFavoritos(fav.idEmprendedor);
                            }}
                            className="w-8 h-8 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center transition cursor-pointer"
                            title="Quitar de favoritos"
                          >
                            <Heart size={16} className="fill-rose-500 text-rose-500" />
                          </button>
                          <ChevronRight
                            size={16}
                            className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center py-8 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                    <Heart size={26} className="text-neutral-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-neutral-900">
                      Sin favoritos guardados
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                      Guarda aquí emprendedores y servicios destacados para contactarlos o volver a consultar su perfil rápidamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNavTab('inicio')}
                    className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95"
                  >
                    Buscar emprendimientos
                  </button>
                </div>
              )}
            </div>
          ) : navTab === 'perfil_emprendedor' ? (
            /* ============================================================== */
            /* PESTAÑA: MI PERFIL (VITRINA PÚBLICA DEL EMPRENDEDOR)           */
            /* Misma página para básico y pro: foto, insignia, reseñas y link */
            /* Diferencia: Pro puede agregar productos, básico no.           */
            /* ============================================================== */
            <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
              {/* Cabecera limpia */}
              <div className="pt-2 pb-3 flex items-center justify-between border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Mi perfil
                  </h2>
                  {esProActivo ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                      Pro
                    </span>
                  ) : yaTuvoPro ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorPro('');
                        setMensajeProExito('');
                        setProSlideUpAbierto(true);
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-dashed border-neutral-300 text-neutral-400 bg-transparent hover:border-neutral-500 hover:text-neutral-600 transition cursor-pointer active:scale-95"
                      title="Pasarme a Pro"
                    >
                      Pro
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Contenido limpio del perfil */}
              <div className="space-y-5 pt-3">
                {/* Cabecera de perfil psicológica y minimalista (estilo Instagram/redes) */}
                <div className="flex flex-col items-center text-center space-y-2 pt-1">
                  {/* Foto de perfil con lapicito para editar foto */}
                  <div className="relative">
                    <div className="w-22 h-22 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shadow-xs">
                      {fotoActual ? (
                        <img
                          src={fotoActual}
                          alt={perfilCliente?.Nombre || emprendedorCuenta?.Nombre || 'Emprendedor'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-700">
                          {(perfilCliente?.Nombre || emprendedorCuenta?.Nombre || 'E').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fotoPerfilAvatarInputRef.current?.click()}
                      disabled={actualizandoFoto}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer active:scale-95 transition"
                      title="Cambiar foto de perfil"
                    >
                      {actualizandoFoto ? (
                        <RefreshCw size={11} className="animate-spin text-white" />
                      ) : (
                        <Pencil size={11} className="text-white" />
                      )}
                    </button>
                  </div>

                  {/* Nombre y verificación en verde lima como único acento */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                      {perfilCliente?.Nombre || emprendedorCuenta?.Nombre || 'Emprendedor One Day'}
                    </h3>
                    <LimeVerifiedBadge size={19} />
                  </div>

                  {/* Qué es y dónde (sin categoría, sin rango de precios) */}
                  <p className="text-xs text-neutral-500 font-normal">
                    {obtenerTextoServicioLimpio(
                      emprendedorCuenta?.Servicio,
                      emprendedorCuenta?.Ubicacion,
                      emprendedorCuenta?.Modalidad
                    )}
                  </p>

                  {/* Calificación sutil de reseñas */}
                  <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 pt-0.5">
                    <Star size={13} className="fill-neutral-900 text-neutral-900" />
                    <span className="font-semibold text-neutral-900">
                      {calcularPuntuacionResenas(resenasEmprendedor).promedioTexto}
                    </span>
                    <span className="text-neutral-400">
                      ({resenasEmprendedor.length} {resenasEmprendedor.length === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>

                  {/* Espacio para biografía solo si ya fue agregada */}
                  {bioTexto && bioTexto.trim() ? (
                    <div className="w-full pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {bioTexto}
                      </p>
                    </div>
                  ) : null}

                  {/* Botones estilo Instagram debajo de la biografía: Editar perfil y Compartir perfil */}
                  <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
                    <button
                      type="button"
                      onClick={handleAbrirEditarPerfil}
                      className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition active:scale-95 cursor-pointer text-center shadow-2xs"
                    >
                      Editar perfil
                    </button>
                    <button
                      type="button"
                      onClick={handleCopiarLinkPerfil}
                      className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Share2 size={13} className="text-neutral-600" />
                      <span>{linkCopiado ? 'Copiado' : 'Compartir perfil'}</span>
                    </button>
                  </div>
                </div>

                {/* Catálogo: Si tengo pro, tiene que mostrar mi perfil, el catálogo y las reseñas. Si no es pro, solo mi perfil y las reseñas. */}
                {esProActivo && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Catálogo {productosEmprendedor.length > 0 && `(${productosEmprendedor.length}/${obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria)})`}
                      </h4>
                      {productosEmprendedor.length > 0 && productosEmprendedor.length < obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria) && (
                        <button
                          type="button"
                          onClick={() => setModalNuevoProducto(true)}
                          className="text-xs font-semibold text-neutral-900 hover:text-black underline cursor-pointer"
                        >
                          + Agregar producto
                        </button>
                      )}
                    </div>

                    {productosEmprendedor.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => setModalNuevoProducto(true)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100/80 hover:bg-neutral-200/70 transition flex items-center justify-between gap-3.5 cursor-pointer active:scale-98 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ShoppingBag size={18} className="text-neutral-700 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-semibold text-neutral-900">
                              Añadir catálogo
                            </h5>
                            <p className="text-[11px] text-neutral-400 font-normal leading-snug">
                              Añade tus productos o servicios para que tus clientes conozcan lo que ofreces (máximo {obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria)} ítems).
                            </p>
                          </div>
                        </div>
                        <Plus size={16} className="text-neutral-600 shrink-0" />
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {productosEmprendedor.map((prod) => (
                          <div
                            key={prod.id}
                            className="w-full p-3 bg-neutral-100/70 rounded-2xl flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-11 h-11 rounded-xl bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                                {prod.foto ? (
                                  <img src={prod.foto} alt={prod.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <ShoppingBag size={18} className="text-neutral-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-semibold text-neutral-900 truncate">
                                  {prod.nombre}
                                </h5>
                                <p className="text-xs font-semibold text-neutral-800">
                                  {prod.precio}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEliminarProducto(prod.id)}
                              className="w-7 h-7 rounded-full bg-white hover:bg-red-50 text-neutral-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
                              title="Eliminar producto"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reseñas: Se muestran si hay opiniones de clientes registradas (tanto en no Pro como en Pro) */}
                {resenasEmprendedor && resenasEmprendedor.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
                      Opiniones de clientes
                    </h4>
                    <ResenasCarrusel resenas={resenasEmprendedor} />
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-start">
              {/* Cabecera con One Day en medio y popover de perfil en la esquina superior derecha */}
              <header className="pt-6 pb-9 relative flex items-center justify-center">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  One Day
                </h1>

                {/* Burbuja y popover esquinero */}
                <div ref={perfilPopRef} className="absolute right-0 top-6">
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
                          onClick={() => handleAbrirModalAuth('iniciar_sesion')}
                          className="w-full py-2.5 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium text-center transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                        >
                          <span>Iniciar sesión o registrarte</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPerfilPopAbierto(false);
                            setCurrentScreen('perfil');
                          }}
                          className="w-full py-2.5 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium text-center transition cursor-pointer active:scale-98"
                        >
                          Mi cuenta
                        </button>
                      )}

                      <div className="border-t border-neutral-100 my-1.5" />

                      <div className="space-y-0.5">
                        <a
                          href="https://wa.me/50236723524?text=Hola%20One%20Day,%20necesito%20soporte%20al%20cliente"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setPerfilPopAbierto(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-neutral-100 text-xs font-medium text-neutral-800 flex items-center justify-between transition text-left cursor-pointer"
                        >
                          <span>Soporte al cliente</span>
                          <Headset size={14} className="text-neutral-500" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setPerfilPopAbierto(false);
                            setCurrentScreen('terminos');
                          }}
                          className="w-full px-3 py-2 rounded-xl hover:bg-neutral-100 text-xs font-medium text-neutral-800 flex items-center justify-between transition text-left cursor-pointer"
                        >
                          <span>Términos y condiciones</span>
                        </button>

                        {authUser && (
                          <button
                            type="button"
                            onClick={handleCerrarSesion}
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
              </header>

              {/* Barra redonda con "¿Qué necesitas?" */}
              <section className="mb-7">
                <div
                  onClick={() => abrirSlideUp()}
                  className="w-full h-15 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded-full px-6 flex items-center justify-between cursor-pointer transition shadow-xs"
                >
                  <span className="text-lg font-normal text-neutral-400 select-none">
                    ¿Qué necesitas?
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500">
                    <Search size={16} />
                  </div>
                </div>
              </section>

              {/* Explorar categorías */}
              {navTab === 'inicio' ? (
                <section className="space-y-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 pl-1">
                    Explorar categorías
                  </h2>

                  <div className="grid grid-cols-4 gap-3">
                    {CATEGORIAS_CONFIG.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => abrirCategoriaSlideUp(cat.id)}
                        className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none group"
                      >
                        <div className="w-16 h-16 rounded-full border border-neutral-200 bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition shadow-xs">
                          <span className="w-6 h-6 rounded-full bg-neutral-300" />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight text-neutral-700 group-hover:text-neutral-900">
                          {cat.nombre}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 pl-1">
                    Categorías
                  </h2>
                  <div className="space-y-2.5">
                    {CATEGORIAS_CONFIG.map((cat) => {
                      const estaDesplegada = categoriaInlineAbierta === cat.id;
                      const items = serviciosPorCategoria[cat.id] || [];

                      return (
                        <div
                          key={cat.id}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 transition space-y-3"
                        >
                          <div
                            onClick={() => handleToggleCategoriaInline(cat.id)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <span className="text-sm font-semibold text-neutral-800">
                              {cat.nombre}
                            </span>
                            <button
                              type="button"
                              className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 shadow-2xs hover:bg-neutral-100 transition"
                            >
                              {estaDesplegada ? <Minus size={14} /> : <Plus size={14} />}
                            </button>
                          </div>

                          {estaDesplegada && (
                            <div className="pt-1 animate-in fade-in duration-150">
                              {items.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {items.map((serv, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => abrirSlideUp(serv)}
                                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-900 hover:text-white border border-neutral-300 text-neutral-800 text-xs font-medium transition cursor-pointer shadow-2xs active:scale-95"
                                    >
                                      {serv}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-neutral-400 italic">
                                  No hay opciones disponibles en esta categoría por ahora.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>
          )
        ) : currentScreen === 'perfil' ? (
          /* ============================================================== */
          /* PANTALLA: ESPACIO DE PERFIL DE CUENTA                          */
          /* Estructura solicitada: Asistencia, luego su foto y hola nombre */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
            <div className="space-y-6">
              {/* Encabezado con flecha para volver */}
              <div className="flex items-center justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('principal')}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                  title="Volver"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              {/* Input de archivo oculto para la foto de perfil */}
              <input
                ref={fotoPerfilAvatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleActualizarSoloFoto}
                className="hidden"
              />

              {!esEmprendedorAprobado ? (
                /* ============================================================== */
                /* PERFIL DE CLIENTE (NUEVA DISTRIBUCIÓN SEGÚN REFERENCIA)        */
                /* ============================================================== */
                <div className="space-y-6 pt-4 animate-in fade-in duration-150">
                  {/* Fila superior: Nombre con badge gris a la izquierda, Foto a la derecha */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0 pt-1">
                      {/* Hola, Nombre y Apellido al lado del gran símbolo de verificación gris */}
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                          Hola, {obtenerNombreYApellido(perfilCliente?.Nombre || authUser?.displayName)}
                        </h2>

                        {/* Símbolo grande de verificación gris al lado del nombre */}
                        <button
                          type="button"
                          onClick={() => {
                            setPasoVerificacion(1);
                            setCurrentScreen('verificacion');
                          }}
                          className="p-1 rounded-full border-2 border-dashed border-neutral-300 hover:border-neutral-500 hover:bg-neutral-100 transition cursor-pointer active:scale-95 inline-flex items-center justify-center shrink-0"
                          title="Verificar cuenta como emprendedor"
                        >
                          <GrayVerifiedBadge size={26} />
                        </button>
                      </div>

                      {/* Promedio de reseñas real desde Firebase Firestore y etiqueta Pro si aplica */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-900 text-xs font-bold"
                          title="Promedio de reseñas"
                        >
                          <Star size={13} className="fill-neutral-900 text-neutral-900" />
                          <span>{calcularPuntuacionResenas(resenasEmprendedor).promedioTexto}</span>
                        </div>

                        {esProActivo ? (
                          <div
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold tracking-wide shadow-2xs"
                            title="Cuenta OneDay Pro activa"
                          >
                            <span>Pro</span>
                          </div>
                        ) : yaTuvoPro ? (
                          <button
                            type="button"
                            onClick={() => {
                              setErrorPro('');
                              setMensajeProExito('');
                              setProSlideUpAbierto(true);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-md border border-dashed border-neutral-300 text-neutral-400 bg-transparent hover:border-neutral-500 hover:text-neutral-600 text-xs font-bold tracking-wide transition cursor-pointer active:scale-95"
                            title="Pasarme a Pro"
                          >
                            <span>Pro</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Foto de perfil al lado con botón de lapicito */}
                    <div className="relative shrink-0">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-100 shadow-xs">
                        {fotoActual ? (
                          <img
                            src={fotoActual}
                            alt={perfilCliente?.Nombre || 'Foto de perfil'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-600 flex items-center justify-center text-white">
                            <UserIcon size={32} />
                          </div>
                        )}
                      </div>

                      {/* Lapicito en la esquina para editar únicamente la foto */}
                      <button
                        type="button"
                        onClick={() => fotoPerfilAvatarInputRef.current?.click()}
                        disabled={actualizandoFoto}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer active:scale-95 transition"
                        title="Cambiar foto de perfil"
                      >
                        {actualizandoFoto ? (
                          <RefreshCw size={11} className="animate-spin text-white" />
                        ) : (
                          <Pencil size={11} className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dos tarjetas: Ayuda y Bandeja de entrada */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <a
                      href="https://wa.me/50236723524"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                        <Headset size={16} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        Ayuda
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setModalBandeja(true)}
                      className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                        <Inbox size={16} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        Bandeja de entrada
                      </span>
                    </button>
                  </div>


                  {/* Placeholder de anuncio para cuenta de cliente normal: Verifica tu cuenta como emprendedor */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPasoVerificacion(1);
                        setModalVerificarEmprendedor(true);
                      }}
                      className="w-full bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer text-left shadow-2xs border border-neutral-200/60"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0 pr-1 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Anuncio
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                          Verifica tu cuenta como emprendedor
                        </h4>
                        <p className="text-xs text-neutral-500 font-normal leading-relaxed line-clamp-2">
                          Posiciónate como emprendedor de confianza frente a clientes potenciales y haz crecer tu negocio.
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                        <Sparkles size={18} />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* ============================================================== */
                /* PERFIL DE EMPRENDEDOR APROBADO (MISMA DISTRIBUCIÓN)           */
                /* ============================================================== */
                <div className="space-y-6 pt-4 animate-in fade-in duration-150">
                  {/* Fila superior: Nombre con badge verde lima a la izquierda, Foto a la derecha */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0 pt-1">
                      {/* Hola, Nombre y Apellido al lado del símbolo de verificación en verde (sin link) */}
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                          Hola, {obtenerNombreYApellido(perfilCliente?.Nombre || authUser?.displayName)}
                        </h2>

                        {/* Símbolo de verificación en verde (sin link) al lado del nombre */}
                        <div className="inline-flex items-center justify-center shrink-0" title="Emprendedor verificado">
                          <LimeVerifiedBadge size={26} />
                        </div>
                      </div>

                      {/* Promedio de reseñas de emprendedor con estrella y a la par etiqueta Pro si aplica */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-900 text-xs font-bold"
                          title="Promedio de reseñas"
                        >
                          <Star size={13} className="fill-neutral-900 text-neutral-900" />
                          <span>{calcularPuntuacionResenas(resenasEmprendedor).promedioTexto}</span>
                        </div>

                        {esProActivo ? (
                          <div
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold tracking-wide shadow-2xs"
                            title="Cuenta OneDay Pro activa"
                          >
                            <span>Pro</span>
                          </div>
                        ) : yaTuvoPro ? (
                          <button
                            type="button"
                            onClick={() => {
                              setErrorPro('');
                              setMensajeProExito('');
                              setProSlideUpAbierto(true);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-md border border-dashed border-neutral-300 text-neutral-400 bg-transparent hover:border-neutral-500 hover:text-neutral-600 text-xs font-bold tracking-wide transition cursor-pointer active:scale-95"
                            title="Pasarme a Pro"
                          >
                            <span>Pro</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Foto de perfil al lado con botón de lapicito */}
                    <div className="relative shrink-0">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-100 shadow-xs">
                        {fotoActual ? (
                          <img
                            src={fotoActual}
                            alt={perfilCliente?.Nombre || 'Foto de perfil'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-600 flex items-center justify-center text-white">
                            <UserIcon size={32} />
                          </div>
                        )}
                      </div>

                      {/* Lapicito en la esquina para editar únicamente la foto */}
                      <button
                        type="button"
                        onClick={() => fotoPerfilAvatarInputRef.current?.click()}
                        disabled={actualizandoFoto}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer active:scale-95 transition"
                        title="Cambiar foto de perfil"
                      >
                        {actualizandoFoto ? (
                          <RefreshCw size={11} className="animate-spin text-white" />
                        ) : (
                          <Pencil size={11} className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tarjetas de Mi Cuenta: Ayuda y Bandeja de entrada. Para cuentas Pro se agregan Regalos (en lugar de mi tienda) y Billetera */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <a
                      href="https://wa.me/50236723524"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                        <Headset size={16} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        Ayuda
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setModalBandeja(true)}
                      className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                        <Inbox size={16} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        Bandeja de entrada
                      </span>
                    </button>

                    {esProActivo && (
                      <>
                        {/* En lugar de Mi tienda: Tarjeta de Regalos */}
                        <button
                          type="button"
                          onClick={() => setModalRegalos(true)}
                          className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                        >
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                            <Gift size={16} />
                          </div>
                          <span className="text-sm sm:text-base font-bold text-neutral-900">
                            Regalos
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalBilletera(true)}
                          className="bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-left shadow-2xs"
                        >
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                            <Wallet size={16} />
                          </div>
                          <span className="text-sm sm:text-base font-bold text-neutral-900">
                            Billetera
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Banner de anuncio: OneDay Pro. Solo sale cuando es emprendedor NO pro. Si es Pro, no sale nada */}
                  {!esProActivo && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorPro('');
                          setMensajeProExito('');
                          setProSlideUpAbierto(true);
                        }}
                        className="w-full bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 transition rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer text-left shadow-2xs border border-neutral-200/60"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0 pr-1 text-left">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Anuncio
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                            Adquiere OneDay Pro
                          </h4>
                          <p className="text-xs text-neutral-500 font-normal leading-relaxed line-clamp-2">
                            Desbloquea beneficios exclusivos, mayor visibilidad y herramientas avanzadas para tu perfil.
                          </p>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-2xs shrink-0">
                          <Gift size={18} />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Espacio intermedio */}
              <div className="py-2" />
            </div>

            {/* Parte inferior: Cerrar sesión */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCerrarSesion}
                className="w-full h-11 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        ) : currentScreen === 'solicitud_en_proceso' ? (
          /* ============================================================== */
          /* PANTALLA: SOLICITUD EN PROCESO (Blind Matching Slide-Up)      */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
            <div className="space-y-5">
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={reiniciar}
                  className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition"
                >
                  <ArrowLeft size={18} />
                </button>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  One Day
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-900 mb-2">
                  <CheckCircle2 size={22} />
                </div>
                <h2 className="text-2xl font-normal text-neutral-900 tracking-tight">
                  Solicitud enviada
                </h2>
                <p className="text-xs text-neutral-500">
                  Estamos buscando al emprendedor ideal para ti.
                </p>
              </div>

              {solicitudCreada && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-300">
                    #{solicitudCreada.ID_solicitud || solicitudCreada.ID_Solicitud}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900">
                    {solicitudCreada.servicio_buscado || solicitudCreada.Servicio_Buscado}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    {solicitudCreada.presupuesto && <span>{solicitudCreada.presupuesto}</span>}
                    {solicitudCreada.ubicacion_servicios && (
                      <span>• {solicitudCreada.ubicacion_servicios}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setNavTab('actividad');
                  setCurrentScreen('principal');
                }}
                className="w-full h-11 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition"
              >
                Ver en Actividad
              </button>
            </div>

            {/* Slide-up de Blind Matching en tiempo real */}
            {solicitudCreada && (solicitudCreada.ID_solicitud || solicitudCreada.ID_Solicitud) && (
              <BlindMatchingSlideUp
                solicitudId={solicitudCreada.ID_solicitud || solicitudCreada.ID_Solicitud || ''}
                authUid={authUser?.uid}
                onClose={() => {
                  setNavTab('actividad');
                  setCurrentScreen('principal');
                }}
                onIrAActividad={() => {
                  setNavTab('actividad');
                  setCurrentScreen('principal');
                }}
              />
            )}
          </div>
        ) : currentScreen === 'perfil_publico' ? (
          /* ============================================================== */
          /* PANTALLA: PERFIL PÚBLICO DE EMPRENDEDOR (DESDE ENLACE WEB)     */
          /* Solo muestra el nombre, la insignia oficial verde lima,        */
          /* la puntuación, el carrusel de reseñas y opción de reseñar.     */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
            <div className="space-y-6">
              {/* Header público con botón volver y botón de Favoritos (Corazón) */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', window.location.pathname);
                    setCurrentScreen('principal');
                  }}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                  title="Volver"
                >
                  <ArrowLeft size={18} />
                </button>

                {publicoEmprendedor && (
                  <button
                    type="button"
                    onClick={handleToggleFavoritoPublico}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs ${
                      esFavoritoPublico
                        ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                        : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-600 hover:text-rose-500'
                    }`}
                    title={esFavoritoPublico ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    aria-label={esFavoritoPublico ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart
                      size={18}
                      className={esFavoritoPublico ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'}
                    />
                  </button>
                )}
              </div>

              {cargandoPerfilPublico ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
                  <RefreshCw size={24} className="animate-spin text-neutral-400" />
                  <p className="text-xs text-neutral-500">Cargando perfil oficial...</p>
                </div>
              ) : publicoEmprendedor ? (
                <div className="space-y-5">
                  {/* Foto y Datos del Emprendedor (Psicológica y minimalista) */}
                  <div className="flex flex-col items-center text-center space-y-2 pt-2">
                    <div className="w-22 h-22 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shadow-xs">
                      {publicoEmprendedor.Foto ? (
                        <img
                          src={publicoEmprendedor.Foto}
                          alt={publicoEmprendedor.Nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-700">
                          {publicoEmprendedor.Nombre.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Solo el nombre del profesional/emprendedor con la insignia oficial en verde lima como único acento */}
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                        {publicoEmprendedor.Nombre}
                      </h2>
                      <LimeVerifiedBadge size={19} />
                    </div>

                    {/* Qué es y dónde (sin categoría, sin rango de precios) */}
                    <p className="text-xs text-neutral-500 font-normal">
                      {obtenerTextoServicioLimpio(
                        publicoEmprendedor.Servicio,
                        publicoEmprendedor.Ubicacion,
                        publicoEmprendedor.Modalidad
                      )}
                    </p>

                    {/* Calificación sutil de reseñas */}
                    <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 pt-0.5">
                      <Star size={13} className="fill-neutral-900 text-neutral-900" />
                      <span className="font-semibold text-neutral-900">
                        {calcularPuntuacionResenas(publicoResenas).promedioTexto}
                      </span>
                      {publicoResenas.length > 0 && (
                        <span className="text-neutral-400">
                          ({publicoResenas.length} {publicoResenas.length === 1 ? 'reseña' : 'reseñas'})
                        </span>
                      )}
                      {esPublicoPro && (
                        <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                          Pro
                        </span>
                      )}
                    </div>

                    {/* Biografía si está disponible */}
                    {(publicoEmprendedor.Biografia || publicoEmprendedor.biografia) && (
                      <div className="w-full pt-1 text-center">
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {publicoEmprendedor.Biografia || publicoEmprendedor.biografia}
                        </p>
                      </div>
                    )}

                    {/* Botones de acción limpios: Escribir reseña y Compartir perfil */}
                    <div className="w-full pt-2 flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFormResenaNombre('');
                          setFormResenaComentario('');
                          setTipoNombreResena('completo');
                          setFormResenaEstrellas(5);
                          setModalEscribirResena(true);
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Star size={13} className="text-neutral-600" />
                        <span>Escribir reseña</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopiarLinkPublico}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        title="Copiar enlace de este perfil"
                      >
                        <Share2 size={13} className="text-neutral-600" />
                        <span>{linkCopiado ? 'Copiado' : 'Compartir perfil'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Catálogo de productos oficial en Firebase: Si tengo pro, tiene que mostrar mi perfil, el catálogo y las reseñas. Si no es pro, solo mi perfil y las reseñas. */}
                  {esPublicoPro && publicoProductos && publicoProductos.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
                        Catálogo
                      </h4>
                      <div className="flex flex-col gap-2">
                        {publicoProductos.map((prod) => (
                          <div
                            key={prod.id || prod.idItem}
                            className="w-full p-3 bg-neutral-100/70 rounded-2xl flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-11 h-11 rounded-xl bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                                {prod.foto ? (
                                  <img src={prod.foto} alt={prod.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <ShoppingBag size={18} className="text-neutral-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-semibold text-neutral-900 truncate">
                                  {prod.nombre}
                                </h5>
                                <p className="text-xs font-semibold text-neutral-800">
                                  {prod.precio}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sección de Reseñas: Solo se muestra si hay reseñas activas registradas */}
                  {publicoResenas && publicoResenas.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
                        Opiniones de clientes
                      </h4>
                      <ResenasCarrusel
                        resenas={publicoResenas}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <AlertCircle size={28} className="text-neutral-400" />
                  <h3 className="text-base font-bold text-neutral-900">Perfil no encontrado</h3>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    El perfil que intentas consultar no existe o no ha sido aprobado por One Day.
                  </p>
                </div>
              )}
              {/* Footer discreto en perfil público con enlaces a redes sociales */}
              <footer className="pt-10 pb-6 mt-auto text-center flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-3 text-neutral-400">
                  <a
                    href="https://instagram.com/oneday.gt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition shadow-2xs"
                    title="Instagram @oneday.gt"
                    aria-label="Instagram @oneday.gt"
                  >
                    <Instagram size={15} />
                  </a>

                  <a
                    href="https://facebook.com/oneday.xp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition shadow-2xs"
                    title="Facebook oneday.xp"
                    aria-label="Facebook oneday.xp"
                  >
                    <Facebook size={15} />
                  </a>

                  <a
                    href="https://wa.me/50236723524"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition shadow-2xs"
                    title="WhatsApp 502 3672 3524"
                    aria-label="WhatsApp 502 3672 3524"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </footer>
            </div>
          </div>
        ) : currentScreen === 'verificacion' ? (
          /* ============================================================== */
          /* PANTALLA: VERIFICACIÓN ONE DAY (PASO 1 Y PASO 2 EN PÁGINA)     */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150 space-y-4">
            {/* Cabecera con botón volver y Paso indicador */}
            <div className="flex items-center justify-between pt-2 pb-3 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  if (pasoVerificacion === 3) {
                    setPasoVerificacion(2);
                  } else if (pasoVerificacion === 2) {
                    setPasoVerificacion(1);
                  } else {
                    setCurrentScreen('perfil');
                  }
                }}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                title="Volver"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Indicador de paso en grisito faded */}
              <span className="text-xs text-neutral-400 font-normal tracking-wide">
                {pasoVerificacion === 1 ? 'Paso 1' : pasoVerificacion === 2 ? 'Paso 2' : 'Paso 3'}
              </span>

              <div className="w-9 h-9" />
            </div>

            {/* Contenedor dinámico según Paso 1, Paso 2 o Paso 3 */}
            <div className="flex-1 flex flex-col justify-start pt-2 space-y-4">
              {pasoVerificacion === 1 ? (
                /* ---------------------------------------------------------- */
                /* PASO 1: SELECCIÓN DE CATEGORÍA                             */
                /* ---------------------------------------------------------- */
                <div className="flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-left-4 duration-250 space-y-5">
                  <div className="space-y-6">
                    {/* Bloque de títulos centrado */}
                    <div className="text-center space-y-2 pb-2 px-2">
                      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                        Verificación One Day
                      </h1>
                      <p className="text-sm font-normal text-neutral-800 max-w-xs mx-auto leading-relaxed">
                        Posiciónate como emprendedor de confianza frente a nuestra comunidad de clientes potenciales.
                      </p>
                      <p className="text-xs text-neutral-400 font-normal pt-1">
                        Elige tu categoría
                      </p>
                    </div>

                    {/* Cuatro tarjetas seleccionables: Profesionales, Creativos, Espacios, Marcas */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                      {[
                        { id: 'Profesionales', nombre: 'Profesionales', desc: 'Servicios técnicos, legales, contables, médicos o consultoría' },
                        { id: 'Creativos', nombre: 'Creativos', desc: 'Diseño, fotografía, producción audiovisual, arte y música' },
                        { id: 'Espacios', nombre: 'Espacios', desc: 'Salones, locaciones, ambientación, logística y eventos' },
                        { id: 'Marcas', nombre: 'Marcas', desc: 'Productos propios, moda, repostería, artesanías y retail' },
                      ].map((cat) => {
                        const seleccionada = empCategoria === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setEmpCategoria(cat.id);
                              setPasoVerificacion(2);
                            }}
                            className={`w-full text-left rounded-[22px] p-5 border transition-all duration-200 cursor-pointer active:scale-98 shadow-2xs flex items-center justify-between gap-4 ${
                              seleccionada
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                : 'bg-neutral-50/90 hover:bg-neutral-100/90 text-neutral-900 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <h3 className={`text-base font-bold ${seleccionada ? 'text-white' : 'text-neutral-900'}`}>
                                {cat.nombre}
                              </h3>
                              <p className={`text-xs ${seleccionada ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {cat.desc}
                              </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                              seleccionada
                                ? 'bg-white text-neutral-900'
                                : 'bg-neutral-200/80 text-neutral-600'
                            }`}>
                              <ChevronRight size={16} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Barritas de swipe / paginación al pie de la página (Paso 1 activo) */}
                  <div className="pt-8 pb-3 flex items-center justify-center gap-1.5">
                    <div className="w-6 h-1 bg-neutral-900 rounded-full transition-all duration-300" />
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                  </div>
                </div>
              ) : pasoVerificacion === 2 ? (
                /* ---------------------------------------------------------- */
                /* PASO 2: UBICACIÓN O COBERTURA                              */
                /* ---------------------------------------------------------- */
                <div className="flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-right-4 duration-250 space-y-5">
                  <div className="space-y-6">
                    {/* Bloque de títulos centrado */}
                    <div className="text-center space-y-2 pb-2 px-2">
                      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                        Ubicación
                      </h1>
                      <p className="text-sm font-normal text-neutral-800 max-w-xs mx-auto leading-relaxed">
                        Ubicación o cobertura de tus servicios
                      </p>
                      <p className="text-xs text-neutral-400 font-normal pt-1">
                        Elige la zona, municipio o departamento principal donde ofreces tus servicios
                      </p>
                    </div>

                    {/* Selector de ubicación o cobertura (mismo diseño de pastilla/barra alargada) */}
                    <div className="space-y-4 pt-2">
                      <div className="relative">
                        <select
                          value={empUbicacion}
                          onChange={(e) => setEmpUbicacion(e.target.value)}
                          className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                        >
                          <option value="" disabled>
                            Ubicación o cobertura
                          </option>
                          {GRUPOS_UBICACIONES_GUATEMALA.map((grupo) => (
                            <optgroup key={grupo.grupo} label={grupo.grupo}>
                              {grupo.lugares.map((lugar) => (
                                <option key={lugar} value={lugar}>
                                  {lugar}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                          <ChevronDown size={16} />
                        </div>
                      </div>

                      {/* Botón Confirmar solo visible cuando se selecciona una opción válida */}
                      {Boolean(empUbicacion && empUbicacion.trim()) && (
                        <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                          <button
                            type="button"
                            onClick={() => setPasoVerificacion(3)}
                            className="w-full h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            Confirmar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Barritas de swipe / paginación al pie de la página (Paso 2 activo) */}
                  <div className="pt-8 pb-3 flex items-center justify-center gap-1.5">
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                    <div className="w-6 h-1 bg-neutral-900 rounded-full transition-all duration-300" />
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                  </div>
                </div>
              ) : (
                /* ---------------------------------------------------------- */
                /* PASO 3: RESTO DEL FORMULARIO                               */
                /* ---------------------------------------------------------- */
                <div className="flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-right-4 duration-250 space-y-4">
                  <div className="space-y-4">
                    {/* Encabezado dinámico */}
                    <div className="text-center space-y-1 pb-1">
                      <span className="text-xs text-neutral-400 font-medium block">
                        Solicita verificación para
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                        {empCategoria || 'Servicios'} en {empUbicacion || 'Guatemala'}
                      </h2>
                      <div className="pt-1.5 space-y-0.5">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-800">
                          Te damos la bienvenida, {obtenerNombreYApellido(perfilCliente?.Nombre || authUser?.displayName)}.
                        </p>
                        <p className="text-xs text-neutral-500 font-normal">
                          Completa siete pasos más para verificar tu cuenta como emprendedor.
                        </p>
                      </div>
                    </div>

                    {errorSolicitudEmp && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 text-center">
                        {errorSolicitudEmp}
                      </div>
                    )}

                    <form onSubmit={handleEnviarSolicitudEmprendedor} className="space-y-3">
                      {/* 1. Profesión, servicio o habilidad (con sugerencias dinámicas de Firebase) */}
                      <div className="relative">
                        <input
                          type="text"
                          value={empServicio}
                          onChange={(e) => {
                            setEmpServicio(e.target.value);
                            setMostrarSugerenciasEmp(true);
                          }}
                          onFocus={() => {
                            if (empServicio.trim()) setMostrarSugerenciasEmp(true);
                          }}
                          placeholder="Profesión, servicio o habilidad"
                          className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                          required
                        />
                        {mostrarSugerenciasEmp && sugerenciasEmpServicio.length > 0 && (
                          <div className="absolute top-13 left-0 right-0 bg-white border border-neutral-200 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 animate-in fade-in">
                            {sugerenciasEmpServicio.map((sug, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setEmpServicio(sug);
                                  setMostrarSugerenciasEmp(false);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-neutral-100 rounded-xl text-xs text-neutral-800 transition cursor-pointer"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Modalidad */}
                      <div className="relative">
                        <select
                          value={empModalidad}
                          onChange={(e) => setEmpModalidad(e.target.value)}
                          className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Modalidad
                          </option>
                          <option value="Presencial">Presencial</option>
                          <option value="Remota">Remota</option>
                          <option value="Híbrida">Híbrida</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                          <ChevronDown size={16} />
                        </div>
                      </div>

                      {/* 3. Rango de precios */}
                      <div className="relative">
                        <select
                          value={empRangoPrecios}
                          onChange={(e) => setEmpRangoPrecios(e.target.value)}
                          className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Rango de precios
                          </option>
                          {RANGOS_PRESUPUESTO.map((rango) => (
                            <option key={rango} value={rango}>
                              {rango}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                          <ChevronDown size={16} />
                        </div>
                      </div>

                      {/* 4. Documento de identificación (Foto DPI) */}
                      <div className="relative">
                        <input
                          ref={inputFotoDpiRef}
                          type="file"
                          accept="image/*"
                          onChange={handleSeleccionarFotoDPI}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => inputFotoDpiRef.current?.click()}
                          className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 transition flex items-center justify-between hover:bg-neutral-100 cursor-pointer text-left"
                        >
                          <span className={empDPIFotoPreview ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>
                            {empDPIFotoPreview ? 'Foto de documento cargada' : 'Foto de DPI o documento'}
                          </span>
                          {empDPIFotoPreview ? (
                            <Check size={16} className="text-emerald-600 shrink-0" />
                          ) : (
                            <Upload size={16} className="text-neutral-400 shrink-0" />
                          )}
                        </button>
                      </div>

                      {/* 5. Enlace a CV, LinkedIn o resumen */}
                      <input
                        type="text"
                        value={empCV}
                        onChange={(e) => setEmpCV(e.target.value)}
                        placeholder="Enlace a CV, LinkedIn o resumen"
                        className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                      />

                      {/* 6. Enlace a portafolio (si aplica) */}
                      <input
                        type="text"
                        value={empPortafolio}
                        onChange={(e) => setEmpPortafolio(e.target.value)}
                        placeholder="Enlace a portafolio (si aplica)"
                        className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                      />

                      {/* 7. Número de colegiado, carnet o registro comercial (si aplica) */}
                      <input
                        type="text"
                        value={empColegiado}
                        onChange={(e) => setEmpColegiado(e.target.value)}
                        placeholder="Número de colegiado, carnet o registro comercial (si aplica)"
                        className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                      />

                      {/* Botón Enviar */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={enviandoSolicitudEmp}
                          className="w-full h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          {enviandoSolicitudEmp ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <span>Enviar solicitud</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Barritas de swipe / paginación al pie de la página (Paso 3 activo) */}
                  <div className="pt-8 pb-3 flex items-center justify-center gap-1.5">
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                    <div className="w-2 h-1 bg-neutral-300 rounded-full transition-all duration-300" />
                    <div className="w-6 h-1 bg-neutral-900 rounded-full transition-all duration-300" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : currentScreen === 'terminos_impulso' ? (
          /* ============================================================== */
          /* PANTALLA EN BLANCO: TÉRMINOS Y CONDICIONES (IMPULSA TU PERFIL) */
          /* ============================================================== */
          <ImpulsoTermsView
            onBack={() => setCurrentScreen('principal')}
            onAccept={handleAceptarTerminosImpulso}
            isSaving={guardandoTerminosImpulso}
          />
        ) : (
          /* ============================================================== */
          /* PANTALLA: TÉRMINOS Y CONDICIONES (EN BLANCO)                   */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-start py-2 animate-in fade-in duration-150">
            <header className="flex items-center gap-3 pt-2 pb-6 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setCurrentScreen('principal')}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-lg font-bold text-neutral-900">
                Términos y condiciones
              </h2>
            </header>

            <div className="flex-1 py-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                <FileText size={22} />
              </div>
              <p className="text-xs text-neutral-400">
                Página de Términos y condiciones en blanco.
              </p>
            </div>
          </div>
        )}

        {/* Barra inferior: Navegación principal */}
        <Navbar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          navTab={navTab}
          setNavTab={setNavTab}
          esCuentaEmprendedor={esCuentaEmprendedor}
        />

        {/* ============================================================== */}
        {/* MODAL: COMPLETAR O EDITAR PERFIL (CON FOTO Y TELÉFONO +502)    */}
        {/* ============================================================== */}
        {modalCompletarPerfil && !perfilCliente?.ID_Cliente && (
          <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-base font-bold text-neutral-900">
                    Completa tu registro
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Ingresa tu nombre y número de teléfono (+502) para coordinar tus solicitudes.
                </p>
              </div>

              {errorPerfil && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 text-center">
                  {errorPerfil}
                </div>
              )}

              <form onSubmit={handleGuardarPerfil} className="space-y-3.5">
                {/* Selector y Preview de Foto */}
                <div className="flex flex-col items-center gap-2 pt-1 pb-1">
                  <div
                    onClick={() => inputFotoRef.current?.click()}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 overflow-hidden flex flex-col items-center justify-center cursor-pointer relative group transition"
                  >
                    {formFotoPreview ? (
                      <img
                        src={formFotoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400 group-hover:text-neutral-700">
                        <Camera size={20} />
                        <span className="text-[9px] mt-0.5">Subir foto</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition rounded-full">
                      <Upload size={16} />
                    </div>
                  </div>

                  <input
                    ref={inputFotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSeleccionarFoto}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                  >
                    {formFotoPreview ? 'Cambiar foto de perfil' : 'Seleccionar foto de perfil'}
                  </button>
                </div>

                {/* Nombre completo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                </div>

                {/* Correo electrónico */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                </div>

                {/* Teléfono con selector automático +502 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Número de teléfono
                  </label>
                  <div className="flex h-12 rounded-full border border-neutral-300 bg-neutral-50 overflow-hidden focus-within:border-neutral-900 transition">
                    <div className="px-3.5 bg-neutral-100 border-r border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 shrink-0 select-none">
                      <span className="text-sm">🇬🇹</span>
                      <span>+502</span>
                    </div>
                    <input
                      type="tel"
                      value={formTelefono}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9\s-]/g, '');
                        setFormTelefono(val);
                      }}
                      placeholder="5555 1234"
                      maxLength={12}
                      className="flex-1 px-4 text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 pl-3 block">
                    8 dígitos de contacto para coordinar tus solicitudes
                  </span>
                </div>

                {/* Botón Guardar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardandoPerfil}
                    className="w-full h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {guardandoPerfil ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <span>Guardar y registrarme</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: INICIAR SESIÓN O REGISTRARSE                            */}
        {/* ============================================================== */}
        <AuthModal
          isOpen={modalAuth}
          onClose={handleCerrarModalAuth}
          authModo={authModo}
          setAuthModo={setAuthModo}
          authNombre={authNombre}
          setAuthNombre={setAuthNombre}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          cargandoAuth={cargandoAuth}
          errorAuth={errorAuth}
          setErrorAuth={setErrorAuth}
          setCargandoAuth={setCargandoAuth}
          handleSubmitAuth={handleSubmitAuth}
          handleContinuarGoogle={handleContinuarGoogle}
        />

        {/* ============================================================== */}
        {/* SLIDE UP DE ESFERAS DE INICIO                                  */}
        {/* ============================================================== */}
        {categoriaModalAbierta && (
          <div
            onClick={cerrarCategoriaSlideUp}
            className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity"
          />
        )}

        <div
          className={`fixed inset-x-0 bottom-0 z-50 w-full max-w-md mx-auto bg-white rounded-t-[28px] shadow-2xl border-t border-neutral-200 transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
            categoriaModalAbierta ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
        >
          <div className="w-full flex justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          <div className="px-5 py-2.5 flex items-center justify-between border-b border-neutral-100">
            <button
              type="button"
              onClick={cerrarCategoriaSlideUp}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-neutral-900 capitalize">
              {CATEGORIAS_CONFIG.find((c) => c.id === categoriaModalAbierta)?.nombre}
            </span>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {categoriaModalAbierta && (serviciosPorCategoria[categoriaModalAbierta] || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(serviciosPorCategoria[categoriaModalAbierta] || []).map((serv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => seleccionarTagServicio(serv)}
                    className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-800 text-xs font-medium transition cursor-pointer shadow-2xs active:scale-95"
                  >
                    {serv}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-neutral-500">
                No hay opciones registradas en esta categoría por ahora.
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SLIDE UP: FORMULARIO PRINCIPAL                                 */}
        {/* ============================================================== */}
        {isSlideUpOpen && (
          <div
            onClick={cerrarSlideUp}
            className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity"
          />
        )}

        <div
          className={`fixed inset-x-0 bottom-0 z-50 w-full max-w-md mx-auto bg-white rounded-t-[28px] shadow-2xl border-t border-neutral-200 transition-transform duration-300 ease-out max-h-[92vh] flex flex-col ${
            isSlideUpOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
        >
          <div className="w-full flex justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          <div className="px-5 py-2.5 flex items-center justify-between border-b border-neutral-100">
            <button
              type="button"
              onClick={cerrarSlideUp}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-neutral-900 block leading-tight">
                Nueva solicitud
              </span>
              <span className="text-[11px] text-neutral-500">
                Buscar un emprendedor
              </span>
            </div>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
            <form onSubmit={handleEnviar} className="space-y-3">
              {/* Título: Qué buscas */}
              <div className="px-1 pt-0.5">
                <span className="text-xs font-semibold text-neutral-700">
                  Qué buscas
                </span>
              </div>

              {/* Burbujas de selección de los servicios existentes en la categoría emprendedores */}
              {serviciosDisponibles.length > 0 && (
                <div className="space-y-1.5 pt-0.5 pb-1">
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto py-1 pr-1">
                    {serviciosDisponibles.map((servicio, idx) => {
                      const seleccionado = servicioBuscado === servicio;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setServicioBuscado(seleccionado ? '' : servicio);
                          }}
                          className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer select-none ${
                            seleccionado
                              ? 'bg-neutral-900 text-white font-medium shadow-xs border border-neutral-900'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 border border-neutral-200/80 font-normal'
                          }`}
                        >
                          {servicio}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Campo 2: Detállanos qué necesitas */}
              <div className="relative">
                <input
                  type="text"
                  maxLength={150}
                  value={detallesNecesidad}
                  onChange={(e) => setDetallesNecesidad(e.target.value)}
                  placeholder="Detállanos qué necesitas"
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-14 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                  required
                />
                <span className="absolute right-4 top-4 text-[10px] text-neutral-400 font-mono pointer-events-none">
                  {detallesNecesidad.length}/150
                </span>
              </div>

              {/* Campo 3: Presupuesto estimado */}
              <div className="relative">
                <select
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition"
                  required
                >
                  <option value="" disabled>
                    Presupuesto estimado
                  </option>
                  {RANGOS_PRESUPUESTO.map((rango) => (
                    <option key={rango} value={rango}>
                      {rango}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Campo 4 y 5: Dónde y cuándo lo necesitas */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-neutral-700">
                    Dónde y cuándo lo necesitas
                  </span>
                  <div className="flex bg-neutral-100 p-0.5 rounded-full border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => seleccionarTipoUbicacion('presencial')}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                        tipoUbicacion === 'presencial'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <MapPin size={12} />
                      <span>Presencial</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => seleccionarTipoUbicacion('remoto')}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                        tipoUbicacion === 'remoto'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <Laptop size={12} />
                      <span>Remoto</span>
                    </button>
                  </div>
                </div>

                {tipoUbicacion === 'remoto' ? (
                  <div className="w-full h-12 bg-neutral-100 border border-neutral-300 rounded-full px-5 text-xs text-neutral-500 flex items-center select-none">
                    Remoto (en línea o a distancia)
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={ubicacionTexto}
                      onChange={(e) => setUbicacionTexto(e.target.value)}
                      className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                      required
                    >
                      <option value="" disabled>
                        Dirección o punto de referencia
                      </option>
                      {GRUPOS_UBICACIONES_GUATEMALA.map((grupo) => (
                        <optgroup key={grupo.grupo} label={grupo.grupo}>
                          {grupo.lugares.map((lugar) => (
                            <option key={lugar} value={lugar}>
                              {lugar}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Campo 5: Fecha estimada */}
              <div className="pt-1">
                <input
                  type="date"
                  value={fechaEstimada}
                  onChange={(e) => setFechaEstimada(e.target.value)}
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                  required
                />
              </div>

              {/* Botón Solicitar */}
              <div className="pt-2 pb-3 space-y-1">
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {enviando ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <span>Solicitar</span>
                  )}
                </button>
                <div className="text-center">
                  <span className="text-[11px] text-neutral-400">
                    Buscar un emprendedor
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL: COMPLETAR SOLICITUD DE EMPRENDEDOR                      */}
        {/* ============================================================== */}
        {modalVerificarEmprendedor && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
              {/* Texto limpio en gris hasta arriba que dice Completar solicitud */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-semibold text-neutral-600">
                  Completar solicitud
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarSugerenciasEmp(false);
                    setModalVerificarEmprendedor(false);
                  }}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {errorSolicitudEmp && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 text-center">
                  {errorSolicitudEmp}
                </div>
              )}

              <form onSubmit={handleEnviarSolicitudEmprendedor} className="space-y-3">
                {/* 1. Categoría */}
                <div className="relative">
                  <select
                    value={empCategoria}
                    onChange={(e) => setEmpCategoria(e.target.value)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Categoría
                    </option>
                    <option value="Profesionales">Profesionales</option>
                    <option value="Creativos">Creativos</option>
                    <option value="Espacios">Espacios</option>
                    <option value="Marcas">Marcas</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* 2. Profesión, servicio o habilidad (con sugerencias dinámicas de Firebase) */}
                <div className="relative">
                  <input
                    type="text"
                    value={empServicio}
                    onChange={(e) => {
                      setEmpServicio(e.target.value);
                      setMostrarSugerenciasEmp(true);
                    }}
                    onFocus={() => {
                      if (empServicio.trim()) setMostrarSugerenciasEmp(true);
                    }}
                    placeholder="Profesión, servicio o habilidad"
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                  {mostrarSugerenciasEmp && sugerenciasEmpServicio.length > 0 && (
                    <div className="absolute top-13 left-0 right-0 bg-white border border-neutral-200 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 animate-in fade-in">
                      {sugerenciasEmpServicio.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setEmpServicio(sug);
                            setMostrarSugerenciasEmp(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-neutral-100 rounded-xl text-xs text-neutral-800 transition cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Modalidad */}
                <div className="relative">
                  <select
                    value={empModalidad}
                    onChange={(e) => setEmpModalidad(e.target.value)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Modalidad
                    </option>
                    <option value="Presencial">Presencial</option>
                    <option value="Remota">Remota</option>
                    <option value="Híbrida">Híbrida</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* 4. Ubicación o cobertura */}
                <div className="relative">
                  <select
                    value={empUbicacion}
                    onChange={(e) => setEmpUbicacion(e.target.value)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Ubicación o cobertura
                    </option>
                    {GRUPOS_UBICACIONES_GUATEMALA.map((grupo) => (
                      <optgroup key={grupo.grupo} label={grupo.grupo}>
                        {grupo.lugares.map((lugar) => (
                          <option key={lugar} value={lugar}>
                            {lugar}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* 5. Rango de precios (mismo desplegable que en solicitudes) */}
                <div className="relative">
                  <select
                    value={empRangoPrecios}
                    onChange={(e) => setEmpRangoPrecios(e.target.value)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Rango de precios
                    </option>
                    {RANGOS_PRESUPUESTO.map((rango) => (
                      <option key={rango} value={rango}>
                        {rango}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-3.5 text-neutral-500">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* 6. Documento de identificación (Subir foto del documento DPI) */}
                <div className="relative">
                  <input
                    ref={inputFotoDpiRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSeleccionarFotoDPI}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputFotoDpiRef.current?.click()}
                    className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 transition flex items-center justify-between hover:bg-neutral-100 cursor-pointer text-left"
                  >
                    <span className={empDPIFotoPreview ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>
                      {empDPIFotoPreview ? 'Foto de documento cargada' : 'Foto de DPI o documento'}
                    </span>
                    {empDPIFotoPreview ? (
                      <Check size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Upload size={16} className="text-neutral-400 shrink-0" />
                    )}
                  </button>
                </div>

                {/* 7. Enlace a CV, LinkedIn o resumen */}
                <input
                  type="text"
                  value={empCV}
                  onChange={(e) => setEmpCV(e.target.value)}
                  placeholder="Enlace a CV, LinkedIn o resumen"
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                />

                {/* 8. Enlace a portafolio (si aplica) */}
                <input
                  type="text"
                  value={empPortafolio}
                  onChange={(e) => setEmpPortafolio(e.target.value)}
                  placeholder="Enlace a portafolio (si aplica)"
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                />

                {/* 9. Número de colegiado, carnet o registro comercial (si aplica) */}
                <input
                  type="text"
                  value={empColegiado}
                  onChange={(e) => setEmpColegiado(e.target.value)}
                  placeholder="Número de colegiado, carnet o registro comercial (si aplica)"
                  className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-full px-5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 transition"
                />

                {/* Botón Enviar */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={enviandoSolicitudEmp}
                    className="w-full h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {enviandoSolicitudEmp ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <span>Enviar</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: ESCRIBIR RESEÑA (DESDE ENLACE DE PERFIL PÚBLICO)        */}
        {/* ============================================================== */}
        {modalEscribirResena && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Escribir reseña
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalEscribirResena(false)}
                    className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  Comparte tu experiencia con {publicoEmprendedor?.Nombre || 'el emprendedor'}.
                </p>
              </div>

              {mensajeResenaExito && (
                <div className="py-2 px-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-700 text-center font-normal">
                  {mensajeResenaExito}
                </div>
              )}

              <form onSubmit={handlePublicarResena} className="space-y-3.5">
                {/* Selector interactivo y minimalista de estrellas */}
                <div className="flex flex-col items-center gap-1 py-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((estrella) => (
                      <button
                        key={estrella}
                        type="button"
                        onClick={() => setFormResenaEstrellas(estrella)}
                        className="p-1 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          size={22}
                          className={
                            estrella <= formResenaEstrellas
                              ? 'fill-neutral-900 text-neutral-900'
                              : 'text-neutral-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tu nombre con toggle Completo / Anónimo adentro de la misma pastilla */}
                <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-neutral-600">
                      Tu nombre
                    </span>
                    <div className="flex bg-neutral-200/70 p-0.5 rounded-full text-[10px] font-medium">
                      <button
                        type="button"
                        onClick={() => {
                          setTipoNombreResena('completo');
                          if (formResenaNombre === 'Anónimo') setFormResenaNombre('');
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                          tipoNombreResena === 'completo'
                            ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        Completo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTipoNombreResena('anonimo');
                          setFormResenaNombre('Anónimo');
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                          tipoNombreResena === 'anonimo'
                            ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        Anónimo
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formResenaNombre}
                    onChange={(e) => {
                      setFormResenaNombre(e.target.value);
                      if (tipoNombreResena === 'anonimo' && e.target.value !== 'Anónimo') {
                        setTipoNombreResena('completo');
                      }
                    }}
                    placeholder="Nombre completo o iniciales"
                    className="w-full h-10 bg-white border border-neutral-200 rounded-xl px-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                </div>

                {/* Reseña directa: Calidad del servicio, puntualidad, profesionalismo */}
                <div className="space-y-1">
                  <textarea
                    rows={3}
                    value={formResenaComentario}
                    onChange={(e) => setFormResenaComentario(e.target.value)}
                    placeholder="Calidad del servicio, puntualidad, profesionalismo..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl p-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition resize-none"
                    required
                  />
                </div>

                {/* Botón Publicar Reseña */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={enviandoResena}
                    className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold text-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {enviandoResena ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <span>Publicar reseña</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE UP: MEMBRESÍA ONEDAY PRO (PLACEHOLDER)                   */}
        {/* ============================================================== */}
        {proSlideUpAbierto && (
          <div
            onClick={() => setProSlideUpAbierto(false)}
            className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity"
          />
        )}

        <div
          className={`fixed inset-x-0 bottom-0 z-50 w-full max-w-md mx-auto bg-white rounded-t-[28px] shadow-2xl border-t border-neutral-200 transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
            proSlideUpAbierto ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
        >
          {/* Barrita superior de arrastre */}
          <div className="w-full flex justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          {/* Cabecera con botón cerrar */}
          <div className="px-5 py-2.5 flex items-center justify-between border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setProSlideUpAbierto(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <span className="text-xs font-semibold text-neutral-900 tracking-wide">
              OneDay Pro
            </span>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {/* Tarjeta de membresía Pro */}
            <div className="w-full bg-neutral-50/90 border border-neutral-200 rounded-[26px] p-6 space-y-5 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                    Pro
                  </h3>
                  {esProActivo && (
                    <span className="text-[11px] font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 font-medium">
                  Q 150 / al mes
                </p>
              </div>

              {/* Viñetas sin texto (placeholder con barritas) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                  <div className="h-2 bg-neutral-200 rounded-full w-48" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                  <div className="h-2 bg-neutral-200 rounded-full w-36" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                  <div className="h-2 bg-neutral-200 rounded-full w-44" />
                </div>
              </div>

              {errorPro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium text-center animate-in fade-in">
                  {errorPro}
                </div>
              )}

              {mensajeProExito && (
                <div className="py-2.5 px-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-700 font-medium text-center animate-in fade-in">
                  {mensajeProExito}
                </div>
              )}

              {/* Botón de pasarme a OneDay Pro */}
              <button
                type="button"
                onClick={handlePasarAOneDayPro}
                disabled={actualizandoAPro}
                className="w-full py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-98 flex items-center justify-center gap-2"
              >
                {actualizandoAPro ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <span>
                    {esProActivo
                      ? 'Cuenta OneDay Pro Activa'
                      : 'Pasarme a OneDay Pro'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL: FAVORITOS                                               */}
        {/* ============================================================== */}
        {modalFavoritos && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Favoritos
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalFavoritos(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              {listaFavoritos.length > 0 ? (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {listaFavoritos.map((fav) => (
                    <div
                      key={fav.idEmprendedor}
                      onClick={() => {
                        setModalFavoritos(false);
                        cargarPerfilPublico(fav.idEmprendedor);
                      }}
                      className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
                          {fav.foto ? (
                            <img src={fav.foto} alt={fav.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-neutral-700">
                              {fav.nombre.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {fav.nombre}
                          </h4>
                          <p className="text-[11px] text-neutral-500 truncate">{fav.servicio}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-neutral-400 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-1">
                    <Heart size={22} />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-800">
                    Sin favoritos guardados
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    Guarda aquí emprendedores y servicios para contactarlos o volver a solicitar trabajos rápidamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: BANDEJA DE ENTRADA                                      */}
        {/* ============================================================== */}
        {modalBandeja && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Inbox size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Bandeja de entrada
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalBandeja(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-1">
                  <Inbox size={22} />
                </div>
                <h4 className="text-sm font-semibold text-neutral-800">
                  Bandeja al día
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs">
                  No tienes mensajes ni notificaciones pendientes. Tus coordinaciones directas se realizan vía WhatsApp y correo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: BILLETERA                                               */}
        {/* ============================================================== */}
        {modalBilletera && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Billetera
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalBilletera(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Saldo acumulado disponible</span>
                  <span className="text-lg font-extrabold text-neutral-900">Q 0.00</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Los pagos de tus servicios realizados por clientes se liquidan directamente a tu cuenta bancaria o método acordado en Guatemala.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: REGALOS Y METAS ONE DAY CLUB (SUDADERAS, PECHERAS, ETC) */}
        {/* ============================================================== */}
        {modalRegalos && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Gift size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Regalos & Metas
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalRegalos(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-neutral-500 leading-relaxed">
                Alcanza metas de ventas y pedidos completados para solicitar regalos oficiales exclusivos de One Day para tu negocio.
              </p>

              <div className="space-y-3">
                {/* Meta 1: Pechera One Day */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">Pechera One Day Oficial</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        5 ventas
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Pechera técnica porta-herramientas con bordado oficial One Day.
                    </p>
                  </div>
                  <Award size={22} className="text-amber-500 shrink-0" />
                </div>

                {/* Meta 2: Sudadera One Day */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">Sudadera One Day Hoodie</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        15 ventas
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Sudadera exclusiva One Day para emprendedores top de la plataforma.
                    </p>
                  </div>
                  <Award size={22} className="text-purple-500 shrink-0" />
                </div>

                {/* Meta 3: Kit One Day Pro */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">Kit One Day Pro Completo</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        30 ventas
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Gorra One Day + Mochila técnica impermeable + Camiseta oficial.
                    </p>
                  </div>
                  <Award size={22} className="text-emerald-500 shrink-0" />
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/50236723524?text=Hola%20One%20Day,%20quisiera%20consultar%20mi%20meta%20de%20ventas%20para%20solicitar%20un%20regalo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Gift size={14} />
                  <span>Consultar o solicitar regalo</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: COMUNIDAD ONE DAY (GRUPO DE WHATSAPP)                   */}
        {/* ============================================================== */}
        {modalComunidad && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Comunidad One Day
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalComunidad(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Conéctate con otros emprendedores y profesionales de Guatemala. Comparte oportunidades, colaboraciones y resuelve dudas en el grupo de WhatsApp.
                </p>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Grupo de WhatsApp One Day</h5>
                    <p className="text-[11px] text-neutral-500">Comunidad de emprendedores en Guatemala</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/50236723524?text=Hola%20One%20Day,%20quiero%20unirme%20al%20grupo%20oficial%20de%20la%20comunidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <MessageCircle size={15} />
                  <span>Unirme a la comunidad en WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: DETALLE DE SOLICITUD EN ACTIVIDAD                       */}
        {/* ============================================================== */}
        {detalleSolicitudActividad && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <span className="font-mono text-xs font-bold text-neutral-500">
                  #{detalleSolicitudActividad.ID_solicitud || detalleSolicitudActividad.ID_Solicitud}
                </span>
                <button
                  type="button"
                  onClick={() => setDetalleSolicitudActividad(null)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-neutral-400 block">Servicio</span>
                  <h3 className="text-base font-bold text-neutral-900">
                    {detalleSolicitudActividad.servicio_buscado || detalleSolicitudActividad.Servicio_Buscado}
                  </h3>
                </div>

                <div>
                  <span className="text-[11px] text-neutral-400 block">Detalles de la necesidad</span>
                  <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                    {detalleSolicitudActividad.detalles_necesidad || detalleSolicitudActividad.Detalles_Necesidad}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                    <span className="text-[10px] text-neutral-400 block">Presupuesto</span>
                    <span className="font-semibold text-neutral-800">
                      {detalleSolicitudActividad.presupuesto || detalleSolicitudActividad.Presupuesto}
                    </span>
                  </div>
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                    <span className="text-[10px] text-neutral-400 block">Fecha estimada</span>
                    <span className="font-semibold text-neutral-800">
                      {detalleSolicitudActividad.fecha_estimado || detalleSolicitudActividad.Fecha_Estimada}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 text-xs">
                  <span className="text-[10px] text-neutral-400 block">Ubicación</span>
                  <span className="font-medium text-neutral-800">
                    {detalleSolicitudActividad.ubicacion_servicios || detalleSolicitudActividad.Ubicacion_Servicio}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-neutral-500">Estado</span>
                  <span className="px-3 py-1 rounded-full font-bold bg-neutral-900 text-white text-[11px]">
                    {detalleSolicitudActividad.estado || detalleSolicitudActividad.Estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: AGREGAR PRODUCTO (EXCLUSIVO EMPRENDEDOR PRO)            */}
        {/* ============================================================== */}
        {modalNuevoProducto && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Agregar producto o servicio
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalNuevoProducto(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAgregarProducto} className="space-y-3.5">
                {/* Selector de foto de producto */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Foto del producto (opcional)
                  </label>
                  <input
                    ref={inputFotoProdRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const comp = await comprimirImagen(e.target.files[0], 480, 480, 0.7);
                          setProdFoto(comp);
                        } catch (err) {
                          console.warn('Error al comprimir foto producto:', err);
                        }
                      }
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => inputFotoProdRef.current?.click()}
                    className="w-full h-28 bg-neutral-50 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition overflow-hidden relative"
                  >
                    {prodFoto ? (
                      <img src={prodFoto} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-neutral-400">
                        <Camera size={22} />
                        <span className="text-[11px]">Subir foto del producto</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nombre del producto */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Nombre o título
                  </label>
                  <input
                    type="text"
                    value={prodNombre}
                    onChange={(e) => setProdNombre(e.target.value)}
                    placeholder="Ej. Diagnóstico Técnico, Pastel de Chocolate"
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                </div>

                {/* Precio en Quetzales */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Precio (Q)
                  </label>
                  <input
                    type="text"
                    value={prodPrecio}
                    onChange={(e) => setProdPrecio(e.target.value)}
                    placeholder="Ej. Q 150.00"
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 pl-3">
                    Descripción (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={prodDescripcion}
                    onChange={(e) => setProdDescripcion(e.target.value)}
                    placeholder="Detalles sobre lo que incluye o características..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardandoProducto}
                    className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-2"
                  >
                    {guardandoProducto ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-white" />
                        <span>Guardando en catálogo...</span>
                      </>
                    ) : (
                      <span>Publicar producto ({productosEmprendedor.length + 1}/{obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria)})</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EDITAR PERFIL DE EMPRENDEDOR (ESTILO INSTAGRAM)         */}
        {/* Edita biografía (sobrescribe en 'biografias' con su ID),       */}
        {/* lugar de cobertura y modalidad (en 'emprendedores' con su ID), */}
        {/* y foto. Nombre y Servicio bloqueados.                         */}
        {/* ============================================================== */}
        {modalEditarPerfil && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Pencil size={17} className="text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Editar perfil
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalEditarPerfil(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {mensajeExitoEdicion && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{mensajeExitoEdicion}</span>
                </div>
              )}

              <form onSubmit={handleGuardarEdicionPerfil} className="space-y-4">
                {/* 1. Foto de perfil */}
                <div className="flex flex-col items-center space-y-2 pt-1 pb-1">
                  <input
                    ref={inputFotoModalEditarRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const archivo = e.target.files[0];
                        setEditPerfilFotoArchivo(archivo);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setEditPerfilFotoPreview((ev.target?.result as string) || '');
                        };
                        reader.readAsDataURL(archivo);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shadow-xs">
                      {editPerfilFotoPreview ? (
                        <img
                          src={editPerfilFotoPreview}
                          alt="Foto"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-700">
                          {(perfilCliente?.Nombre || emprendedorCuenta?.Nombre || 'E').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => inputFotoModalEditarRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer active:scale-95 transition"
                      title="Cambiar foto de perfil"
                    >
                      <Camera size={12} className="text-white" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => inputFotoModalEditarRef.current?.click()}
                    className="text-xs font-semibold text-neutral-800 hover:text-black underline cursor-pointer"
                  >
                    Cambiar foto de perfil
                  </button>
                </div>

                {/* 2. Nombre (Bloqueado / No modificable) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3">
                    <label className="text-[11px] font-semibold text-neutral-500">
                      Nombre oficial
                    </label>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Lock size={10} /> No modificable
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={perfilCliente?.Nombre || emprendedorCuenta?.Nombre || ''}
                    className="w-full h-11 bg-neutral-100 border border-neutral-200 rounded-full px-4 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>

                {/* 3. Servicio (Bloqueado / No modificable) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3">
                    <label className="text-[11px] font-semibold text-neutral-500">
                      Servicio verificado
                    </label>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Lock size={10} /> No modificable
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={emprendedorCuenta?.Servicio || ''}
                    className="w-full h-11 bg-neutral-100 border border-neutral-200 rounded-full px-4 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>

                {/* 4. Biografía (Editable, se sobrescribe en 'biografias') */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3">
                    <label className="text-[11px] font-semibold text-neutral-700">
                      Biografía
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {editPerfilBio.length}/150
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={150}
                    value={editPerfilBio}
                    onChange={(e) => setEditPerfilBio(e.target.value.slice(0, 150))}
                    placeholder="Escribe tu presentación profesional o biografía (máx. 150 caracteres)..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition resize-none"
                  />
                </div>

                {/* 5. Lugar de cobertura (Editable, se sobrescribe en 'emprendedores') */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-700 pl-3">
                    Lugar o cobertura
                  </label>
                  <div className="relative">
                    <select
                      value={editPerfilUbicacion}
                      onChange={(e) => setEditPerfilUbicacion(e.target.value)}
                      className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-full px-4 pr-10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none transition cursor-pointer"
                    >
                      <option value="" disabled>
                        Selecciona tu lugar de cobertura
                      </option>
                      {GRUPOS_UBICACIONES_GUATEMALA.map((grupo) => (
                        <optgroup key={grupo.grupo} label={grupo.grupo}>
                          {grupo.lugares.map((lugar) => (
                            <option key={lugar} value={lugar}>
                              {lugar}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-3 text-neutral-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                {/* 6. Modalidad (Editable, se sobrescribe en 'emprendedores') */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-neutral-700 pl-3">
                    Modalidad de atención
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Presencial', 'Remoto', 'Híbrido'].map((mod) => {
                      const activo = editPerfilModalidad.toLowerCase() === mod.toLowerCase();
                      return (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => setEditPerfilModalidad(mod)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                            activo
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {mod}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardandoEdicionPerfil}
                    className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-2"
                  >
                    {guardandoEdicionPerfil ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-white" />
                        <span>Guardando cambios...</span>
                      </>
                    ) : (
                      <span>Guardar cambios</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* modalEditarPerfil cierra aquí */}
      </main>
    </div>
  );
}
