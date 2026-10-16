import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SolicitudData,
  CatalogoItemData,
  ProductoEmprendedor,
  SolicitudEnProceso,
  ResenaData,
} from '../types';
import {
  obtenerServiciosDeEmprendedores,
  consultarSolicitudesCliente,
  consultarTrabajosEmprendedor,
  guardarBiografiaEnFirestore,
  obtenerBiografiaDeFirestore,
  obtenerCatalogoEmprendedor,
  guardarItemCatalogoEnFirestore,
  eliminarItemCatalogoDeFirestore,
  eliminarTarjetaImpulsoDeCuenta,
  activarOneDayPro,
  guardarResenaEnFirestore,
  obtenerResenasEmprendedor,
  obtenerMaxItemsCatalogo,
} from '../services/firebaseDataService';
import { useAuth } from './AuthContext';
import { useNavigation } from './NavigationContext';

interface DataContextType {
  // Servicios
  serviciosDisponibles: string[];
  serviciosPorCategoria: { [key: string]: string[] };
  cargarServiciosEmprendedores: () => Promise<void>;
  
  // Actividad
  filtroActividad: 'mis_trabajos' | 'mis_pedidos';
  setFiltroActividad: (f: 'mis_trabajos' | 'mis_pedidos') => void;
  misPedidos: SolicitudData[];
  misTrabajos: SolicitudData[];
  cargandoActividad: boolean;
  cargarActividad: () => Promise<void>;
  detalleSolicitudActividad: SolicitudData | null;
  setDetalleSolicitudActividad: (s: SolicitudData | null) => void;
  
  // SlideUp "¿Qué necesitas?"
  isSlideUpOpen: boolean;
  abrirSlideUp: () => void;
  cerrarSlideUp: () => void;
  solicitudCreada: SolicitudEnProceso | null;
  setSolicitudCreada: (s: SolicitudEnProceso | null) => void;
  
  // Categorías
  categoriaModalAbierta: string | null;
  setCategoriaModalAbierta: (id: string | null) => void;
  categoriaInlineAbierta: string | null;
  setCategoriaInlineAbierta: (id: string | null) => void;
  abrirCategoriaSlideUp: (id: string) => void;
  cerrarCategoriaSlideUp: () => void;
  
  // Pro slide up
  proSlideUpAbierto: boolean;
  setProSlideUpAbierto: (abierto: boolean) => void;
  actualizandoAPro: boolean;
  mensajeProExito: string;
  errorPro: string;
  handlePasarAOneDayPro: () => Promise<void>;
  
  // Biografía emprendedor
  bioTexto: string;
  setBioTexto: React.Dispatch<React.SetStateAction<string>>;
  guardandoBio: boolean;
  handleGuardarBio: (texto: string) => Promise<void>;
  
  // Catálogo productos emprendedor
  productosEmprendedor: ProductoEmprendedor[];
  setProductosEmprendedor: React.Dispatch<React.SetStateAction<ProductoEmprendedor[]>>;
  guardandoProducto: boolean;
  modalNuevoProducto: boolean;
  setModalNuevoProducto: (abierto: boolean) => void;
  handleAgregarProducto: (nombre: string, precio: string, descripcion?: string, foto?: string) => Promise<void>;
  handleEliminarProducto: (idProd?: string) => Promise<void>;
  tarjetaImpulsoEliminada: boolean;
  handleEliminarTarjetaImpulso: () => Promise<void>;
  
  // Modal editar perfil
  modalEditarPerfil: boolean;
  setModalEditarPerfil: (abierto: boolean) => void;
  
  // Modal y publicación de reseñas
  modalEscribirResena: boolean;
  setModalEscribirResena: (abierto: boolean) => void;
  formResenaNombre: string;
  setFormResenaNombre: (nombre: string) => void;
  formResenaEstrellas: number;
  setFormResenaEstrellas: (estrellas: number) => void;
  formResenaComentario: string;
  setFormResenaComentario: (comentario: string) => void;
  mensajeResenaExito: string;
  tipoNombreResena: 'completo' | 'anonimo';
  setTipoNombreResena: (tipo: 'completo' | 'anonimo') => void;
  enviandoResena: boolean;
  handleAbrirEscribirResena: () => void;
  handlePublicarResena: (e: React.FormEvent) => Promise<void>;
  resenasEmprendedor: ResenaData[];
  setResenasEmprendedor: React.Dispatch<React.SetStateAction<ResenaData[]>>;
  
  // Modales de cuenta
  modalFavoritos: boolean;
  setModalFavoritos: (abierto: boolean) => void;
  modalBandeja: boolean;
  setModalBandeja: (abierto: boolean) => void;
  modalBilletera: boolean;
  setModalBilletera: (abierto: boolean) => void;
  modalRegalos: boolean;
  setModalRegalos: (abierto: boolean) => void;
  modalComunidad: boolean;
  setModalComunidad: (abierto: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, perfilCliente, emprendedorCuenta, setEmprendedorCuenta, abrirModalAuth, abrirModalCompletarPerfil } = useAuth();
  const { publicoEmprendedor, setPublicoResenas, navTab } = useNavigation();

  // Servicios
  const [serviciosDisponibles, setServiciosDisponibles] = useState<string[]>([]);
  const [serviciosPorCategoria, setServiciosPorCategoria] = useState<{ [key: string]: string[] }>({
    profesionales: [],
    creativos: [],
    espacios: [],
    marcas: [],
  });

  // Actividad
  const [filtroActividad, setFiltroActividad] = useState<'mis_trabajos' | 'mis_pedidos'>('mis_trabajos');
  const [misPedidos, setMisPedidos] = useState<SolicitudData[]>([]);
  const [misTrabajos, setMisTrabajos] = useState<SolicitudData[]>([]);
  const [cargandoActividad, setCargandoActividad] = useState<boolean>(false);
  const [detalleSolicitudActividad, setDetalleSolicitudActividad] = useState<SolicitudData | null>(null);

  // SlideUp "¿Qué necesitas?"
  const [isSlideUpOpen, setIsSlideUpOpen] = useState<boolean>(false);
  const [solicitudCreada, setSolicitudCreada] = useState<SolicitudEnProceso | null>(null);

  // Categorías
  const [categoriaModalAbierta, setCategoriaModalAbierta] = useState<string | null>(null);
  const [categoriaInlineAbierta, setCategoriaInlineAbierta] = useState<string | null>(null);

  // Pro slide up
  const [proSlideUpAbierto, setProSlideUpAbierto] = useState<boolean>(false);
  const [actualizandoAPro, setActualizandoAPro] = useState<boolean>(false);
  const [mensajeProExito, setMensajeProExito] = useState<string>('');
  const [errorPro, setErrorPro] = useState<string>('');

  // Biografía emprendedor
  const [bioTexto, setBioTexto] = useState<string>('');
  const [guardandoBio, setGuardandoBio] = useState<boolean>(false);

  // Catálogo productos
  const [productosEmprendedor, setProductosEmprendedor] = useState<ProductoEmprendedor[]>([]);
  const [guardandoProducto, setGuardandoProducto] = useState<boolean>(false);
  const [modalNuevoProducto, setModalNuevoProducto] = useState<boolean>(false);
  const [tarjetaImpulsoEliminada, setTarjetaImpulsoEliminada] = useState<boolean>(false);

  // Modal editar perfil
  const [modalEditarPerfil, setModalEditarPerfil] = useState<boolean>(false);

  // Reseñas
  const [modalEscribirResena, setModalEscribirResena] = useState<boolean>(false);
  const [formResenaNombre, setFormResenaNombre] = useState<string>('');
  const [formResenaEstrellas, setFormResenaEstrellas] = useState<number>(5);
  const [formResenaComentario, setFormResenaComentario] = useState<string>('');
  const [mensajeResenaExito, setMensajeResenaExito] = useState<string>('');
  const [tipoNombreResena, setTipoNombreResena] = useState<'completo' | 'anonimo'>('completo');
  const [enviandoResena, setEnviandoResena] = useState<boolean>(false);
  const [resenasEmprendedor, setResenasEmprendedor] = useState<ResenaData[]>([]);

  // Modales de cuenta
  const [modalFavoritos, setModalFavoritos] = useState<boolean>(false);
  const [modalBandeja, setModalBandeja] = useState<boolean>(false);
  const [modalBilletera, setModalBilletera] = useState<boolean>(false);
  const [modalRegalos, setModalRegalos] = useState<boolean>(false);
  const [modalComunidad, setModalComunidad] = useState<boolean>(false);

  // Cargar servicios disponibles
  const cargarServiciosEmprendedores = async () => {
    try {
      const data = await obtenerServiciosDeEmprendedores();
      if (Array.isArray(data.servicios)) {
        setServiciosDisponibles(data.servicios);
      }
      if (data.serviciosPorCategoria) {
        setServiciosPorCategoria({
          profesionales: data.serviciosPorCategoria.profesionales || [],
          creativos: data.serviciosPorCategoria.creativos || [],
          espacios: data.serviciosPorCategoria.espacios || [],
          marcas: data.serviciosPorCategoria.marcas || [],
        });
      }
    } catch (err) {
      console.warn('Error al cargar servicios desde Firebase Firestore:', err);
    }
  };

  useEffect(() => {
    cargarServiciosEmprendedores();
  }, []);

  // Cargar datos de emprendedor activo (biografía, reseñas, catálogo)
  useEffect(() => {
    if (emprendedorCuenta) {
      obtenerBiografiaDeFirestore(emprendedorCuenta.ID_Emprendedor).then((bio) => {
        if (bio) {
          setBioTexto(bio);
        } else if (emprendedorCuenta.Biografia || emprendedorCuenta.biografia) {
          setBioTexto(emprendedorCuenta.Biografia || emprendedorCuenta.biografia || '');
        }
      });
      obtenerResenasEmprendedor(emprendedorCuenta.ID_Emprendedor).then((res) => {
        setResenasEmprendedor(res);
      });
      obtenerCatalogoEmprendedor(emprendedorCuenta.ID_Emprendedor).then((prods) => {
        setProductosEmprendedor(prods);
      });
      if (emprendedorCuenta.tarjeta_impulso_eliminada) {
        setTarjetaImpulsoEliminada(true);
      }
    } else {
      setBioTexto('');
      setResenasEmprendedor([]);
      setProductosEmprendedor([]);
      setTarjetaImpulsoEliminada(false);
    }
  }, [emprendedorCuenta]);

  // Cargar Actividad
  const cargarActividad = async () => {
    if (!authUser) {
      setMisPedidos([]);
      setMisTrabajos([]);
      return;
    }
    setCargandoActividad(true);
    try {
      const [pedidos, trabajos] = await Promise.all([
        consultarSolicitudesCliente(perfilCliente?.ID_Cliente || authUser.uid),
        emprendedorCuenta ? consultarTrabajosEmprendedor(emprendedorCuenta.ID_Emprendedor) : Promise.resolve([]),
      ]);
      setMisPedidos(pedidos);
      setMisTrabajos(trabajos);
    } catch (err) {
      console.error('Error al cargar solicitudes en Actividad:', err);
    } finally {
      setCargandoActividad(false);
    }
  };

  useEffect(() => {
    if (navTab === 'actividad') {
      cargarActividad();
    }
  }, [navTab, authUser, emprendedorCuenta, perfilCliente]);

  const abrirSlideUp = () => setIsSlideUpOpen(true);
  const cerrarSlideUp = () => setIsSlideUpOpen(false);

  const abrirCategoriaSlideUp = (id: string) => setCategoriaModalAbierta(id);
  const cerrarCategoriaSlideUp = () => setCategoriaModalAbierta(null);

  // Pasar a OneDay Pro
  const handlePasarAOneDayPro = async () => {
    if (!authUser) {
      abrirModalAuth('iniciar_sesion');
      return;
    }
    setErrorPro('');
    setMensajeProExito('');

    if (!emprendedorCuenta) {
      setErrorPro('Para pasar a OneDay Pro debes ser un emprendedor registrado. Si eres cliente, primero solicita tu verificación.');
      return;
    }

    setActualizandoAPro(true);
    try {
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

  // Guardar biografía
  const handleGuardarBio = async (texto: string) => {
    if (!authUser || !emprendedorCuenta) return;
    setGuardandoBio(true);
    try {
      const bioLimpia = texto.trim().slice(0, 150);
      await guardarBiografiaEnFirestore(emprendedorCuenta.ID_Emprendedor, bioLimpia);
      setBioTexto(bioLimpia);
      setEmprendedorCuenta({
        ...emprendedorCuenta,
        Biografia: bioLimpia,
        biografia: bioLimpia,
      });
    } catch (err) {
      console.error('Error al guardar biografía en Firestore:', err);
      alert('Hubo un error al guardar tu biografía.');
    } finally {
      setGuardandoBio(false);
    }
  };

  // Agregar producto al catálogo
  const handleAgregarProducto = async (nombre: string, precio: string, descripcion?: string, foto?: string) => {
    if (!nombre.trim() || !precio.trim()) return;
    if (!emprendedorCuenta?.ID_Emprendedor) return;

    const maxItems = obtenerMaxItemsCatalogo(emprendedorCuenta?.Categoria);
    if (productosEmprendedor.length >= maxItems) {
      alert(`Has alcanzado el límite máximo de ${maxItems} productos para tu categoría.`);
      return;
    }

    setGuardandoProducto(true);
    try {
      const idItemGenerado = `ITEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const precioNormalizado = precio.trim().startsWith('Q') ? precio.trim() : `Q ${precio.trim()}`;

      const nuevo = await guardarItemCatalogoEnFirestore(
        emprendedorCuenta.ID_Emprendedor,
        {
          idItem: idItemGenerado,
          nombre: nombre.trim(),
          precio: precioNormalizado,
          foto: foto || '',
          descripcion: descripcion?.trim() || '',
        }
      );

      setProductosEmprendedor((prev) => [nuevo, ...prev.filter((p) => (p.idItem || p.id) !== idItemGenerado)]);
      setModalNuevoProducto(false);
    } catch (err) {
      console.error('Error al guardar ítem de catálogo en Firestore:', err);
      alert('Hubo un error al guardar el producto en el catálogo.');
    } finally {
      setGuardandoProducto(false);
    }
  };

  // Eliminar producto de catálogo
  const handleEliminarProducto = async (idProd?: string) => {
    if (!idProd) return;
    try {
      await eliminarItemCatalogoDeFirestore(idProd);
      setProductosEmprendedor((prev) => prev.filter((p) => (p.idItem || p.id) !== idProd));
    } catch (err) {
      console.error('Error al eliminar ítem de catálogo:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  // Eliminar tarjeta impulso
  const handleEliminarTarjetaImpulso = async () => {
    try {
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
    } catch (err) {
      console.warn('Error al marcar tarjeta de impulso como eliminada:', err);
      setTarjetaImpulsoEliminada(true);
    }
  };

  // Reseñas públicas
  const handleAbrirEscribirResena = () => {
    if (!authUser) {
      abrirModalAuth('iniciar_sesion');
      return;
    }
    if (!perfilCliente) {
      abrirModalCompletarPerfil();
      return;
    }
    setFormResenaNombre(perfilCliente.Nombre || authUser.displayName || '');
    setFormResenaComentario('');
    setTipoNombreResena('completo');
    setFormResenaEstrellas(5);
    setMensajeResenaExito('');
    setModalEscribirResena(true);
  };

  const handlePublicarResena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      setModalEscribirResena(false);
      abrirModalAuth('iniciar_sesion');
      return;
    }
    if (!perfilCliente) {
      setModalEscribirResena(false);
      abrirModalCompletarPerfil();
      return;
    }
    if (!publicoEmprendedor?.ID_Emprendedor) return;

    const nombreFinal = (tipoNombreResena === 'anonimo' || !formResenaNombre.trim())
      ? 'Anónimo'
      : formResenaNombre.trim();

    if (!nombreFinal) {
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
        nombreFinal,
        formResenaEstrellas,
        formResenaComentario.trim()
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

  return (
    <DataContext.Provider
      value={{
        serviciosDisponibles,
        serviciosPorCategoria,
        cargarServiciosEmprendedores,
        filtroActividad,
        setFiltroActividad,
        misPedidos,
        misTrabajos,
        cargandoActividad,
        cargarActividad,
        detalleSolicitudActividad,
        setDetalleSolicitudActividad,
        isSlideUpOpen,
        abrirSlideUp,
        cerrarSlideUp,
        solicitudCreada,
        setSolicitudCreada,
        categoriaModalAbierta,
        setCategoriaModalAbierta,
        categoriaInlineAbierta,
        setCategoriaInlineAbierta,
        abrirCategoriaSlideUp,
        cerrarCategoriaSlideUp,
        proSlideUpAbierto,
        setProSlideUpAbierto,
        actualizandoAPro,
        mensajeProExito,
        errorPro,
        handlePasarAOneDayPro,
        bioTexto,
        setBioTexto,
        guardandoBio,
        handleGuardarBio,
        productosEmprendedor,
        setProductosEmprendedor,
        guardandoProducto,
        modalNuevoProducto,
        setModalNuevoProducto,
        handleAgregarProducto,
        handleEliminarProducto,
        tarjetaImpulsoEliminada,
        handleEliminarTarjetaImpulso,
        modalEditarPerfil,
        setModalEditarPerfil,
        modalEscribirResena,
        setModalEscribirResena,
        formResenaNombre,
        setFormResenaNombre,
        formResenaEstrellas,
        setFormResenaEstrellas,
        formResenaComentario,
        setFormResenaComentario,
        mensajeResenaExito,
        tipoNombreResena,
        setTipoNombreResena,
        enviandoResena,
        handleAbrirEscribirResena,
        handlePublicarResena,
        resenasEmprendedor,
        setResenasEmprendedor,
        modalFavoritos,
        setModalFavoritos,
        modalBandeja,
        setModalBandeja,
        modalBilletera,
        setModalBilletera,
        modalRegalos,
        setModalRegalos,
        modalComunidad,
        setModalComunidad,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
