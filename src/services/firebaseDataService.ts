/**
 * Servicio de datos de One Day operando 100% sobre Firebase Firestore.
 * Conecta las 3 entidades clave:
 * 1. Clientes: ID cliente, nombre, correo, teléfono, foto.
 * 2. Solicitudes: ID_solicitud, ID_cliente, servicio_buscado, detalles_necesidad,
 *    detalle_necesidad, presupuesto, ubicación_servicios, fecha_estimado,
 *    ID_emprendedor_asignado, emprendedor_asignado, estado.
 * 3. Emprendedores: Base de datos de donde se nutre la lista dinámica de servicios
 *    y categorías en One Day.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ClienteData {
  uid: string;
  ID_cliente: string;
  nombre: string;
  correo: string;
  telefono: string;
  foto?: string;
  // Campos en mayúsculas compatibles
  ID_Cliente?: string;
  Nombre?: string;
  Correo?: string;
  Telefono?: string;
  Foto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SolicitudData {
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
  estado: string; // 'Pendiente' | 'Activo' | 'En proceso' | 'Completado' | 'Cancelado'
  cliente_nombre?: string;
  cliente_telefono?: string;
  cliente_correo?: string;
  // Compatibilidad con versiones previas
  ID_Solicitud?: string;
  ID_Cliente?: string;
  Servicio_Buscado?: string;
  Detalles_Necesidad?: string;
  Presupuesto?: string;
  Ubicacion_Servicio?: string;
  Fecha_Estimada?: string;
  Estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmprendedorData {
  ID_Emprendedor: string;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Foto?: string;
  Alias?: string; // Opcional (en desuso)
  Acceso_Plataforma?: string; // Opcional (en desuso)
  Categoria: string;
  Servicio: string;
  Ubicacion: string;
  Modalidad?: string; // 'Presencial' | 'Remota' | 'Híbrida'
  Rango_Precios: string;
  Documento_Identificacion?: string;
  CV?: string;
  Portafolio?: string;
  Numero_Colegiado_Licencia?: string;
  Estado_Aprobacion: string; // 'en revisión' | 'aprobado' | 'denegado'
  Nivel: string; // 'Básico' | 'Verificado' | 'PRO'
  Fecha_PRO?: string;
  fecha_pro?: string;
  membresia_pro?: string; // 'sí' si alguna vez adquirió pro
  Membresia_Pro?: string;
  'membresía pro'?: string;
  'Membresía Pro'?: string;
  Biografia?: string;
  biografia?: string;
  uid?: string;
  ID_Cliente?: string;
  tarjeta_impulso_eliminada?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResenaData {
  ID_reseña: string;
  ID_Emprendedor: string;
  nombre_cliente: string;
  estrellas: number; // 1 a 5
  comentario: string;
  fecha: string;
  createdAt: string;
}

/**
 * Normaliza la categoría para asignación de llaves
 */
function normalizarCategoria(cat: string): string {
  const c = (cat || '').toLowerCase().trim();
  if (c.includes('profesional')) return 'profesionales';
  if (c.includes('creativ')) return 'creativos';
  if (c.includes('espacio')) return 'espacios';
  if (c.includes('marca')) return 'marcas';
  return 'profesionales';
}

/**
 * Obtiene los servicios y categorías dinámicamente desde la colección 'emprendedores' en Firebase Firestore.
 * Solo se incluyen emprendedores reales registrados en la base de datos que hayan sido APROBADOS.
 * Si Firebase está vacío, no se inventa ningún dato y retorna listas vacías.
 */
export async function obtenerServiciosDeEmprendedores(): Promise<{
  servicios: string[];
  serviciosPorCategoria: Record<string, string[]>;
  emprendedores: EmprendedorData[];
}> {
  try {
    const colRef = collection(db, 'emprendedores');
    const snap = await getDocs(colRef);

    const listaEmprendedores: EmprendedorData[] = [];

    if (!snap.empty) {
      snap.forEach((d) => {
        const data = d.data() as EmprendedorData;
        const estado = (data.Estado_Aprobacion || (data as any).estado_aprobacion || (data as any).estado || '').toLowerCase().trim();
        const nivel = (data.Nivel || (data as any).nivel || '').toLowerCase().trim();
        const servicioVal = (data.Servicio || (data as any).servicio || '').trim();

        // Emprendedores válidos en Firebase: aprobados, verificados o registrados con servicio activo
        const esValido =
          estado === 'aprobado' ||
          estado === 'aprobada' ||
          estado === 'verificado' ||
          nivel === 'verificado' ||
          nivel === 'pro' ||
          (!estado && !!servicioVal);

        if (esValido && servicioVal) {
          listaEmprendedores.push({
            ...data,
            Servicio: servicioVal,
            Categoria: (data.Categoria || (data as any).categoria || '').trim(),
          });
        }
      });
    }

    const serviciosPorCat: Record<string, string[]> = {
      profesionales: [],
      creativos: [],
      espacios: [],
      marcas: [],
    };
    const todos: string[] = [];

    listaEmprendedores.forEach((emp) => {
      const catKey = normalizarCategoria(emp.Categoria || '');
      const nombreServicio = (emp.Servicio || '').trim();

      if (nombreServicio) {
        if (!todos.includes(nombreServicio)) {
          todos.push(nombreServicio);
        }
        if (serviciosPorCat[catKey]) {
          if (!serviciosPorCat[catKey].includes(nombreServicio)) {
            serviciosPorCat[catKey].push(nombreServicio);
          }
        }
      }
    });

    return {
      servicios: todos,
      serviciosPorCategoria: serviciosPorCat,
      emprendedores: listaEmprendedores,
    };
  } catch (err) {
    console.warn('Error leyendo emprendedores en Firestore:', err);
    return {
      servicios: [],
      serviciosPorCategoria: {
        profesionales: [],
        creativos: [],
        espacios: [],
        marcas: [],
      },
      emprendedores: [],
    };
  }
}

/**
 * Guarda una nueva solicitud de servicio directamente en Firestore
 * cumpliendo con todas las columnas exactas requeridas por el usuario.
 */
export async function crearSolicitudEnFirestore(
  solicitud: Partial<SolicitudData> & {
    ID_solicitud: string;
    ID_cliente: string;
    servicio_buscado: string;
    detalles_necesidad: string;
    presupuesto: string;
    ubicacion_servicios: string;
    fecha_estimado: string;
  }
): Promise<SolicitudData> {
  const idSolicitud = solicitud.ID_solicitud;
  const docRef = doc(db, 'solicitudes', idSolicitud);

  const payload: SolicitudData = {
    ID_solicitud: idSolicitud,
    ID_cliente: solicitud.ID_cliente,
    servicio_buscado: solicitud.servicio_buscado,
    detalles_necesidad: solicitud.detalles_necesidad,
    detalle_necesidad: solicitud.detalles_necesidad, // alias idéntico
    presupuesto: solicitud.presupuesto,
    ubicacion_servicios: solicitud.ubicacion_servicios,
    fecha_estimado: solicitud.fecha_estimado,
    ID_emprendedor_asignado: solicitud.ID_emprendedor_asignado || '',
    emprendedor_asignado: solicitud.emprendedor_asignado || '',
    estado: solicitud.estado || 'Pendiente',
    cliente_nombre: solicitud.cliente_nombre || '',
    cliente_telefono: solicitud.cliente_telefono || '',
    cliente_correo: solicitud.cliente_correo || '',
    // Compatibilidad mayúsculas
    ID_Solicitud: idSolicitud,
    ID_Cliente: solicitud.ID_cliente,
    Servicio_Buscado: solicitud.servicio_buscado,
    Detalles_Necesidad: solicitud.detalles_necesidad,
    Presupuesto: solicitud.presupuesto,
    Ubicacion_Servicio: solicitud.ubicacion_servicios,
    Fecha_Estimada: solicitud.fecha_estimado,
    Estado: solicitud.estado || 'Pendiente',
    createdAt: solicitud.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload);
  return payload;
}

/**
 * ¿PUEDE LA APLICACIÓN SOBRESCRIBIR LA INFORMACIÓN AL PRESIONAR UN BOTÓN?
 * ¡SÍ! Esta función es la respuesta directa a la pregunta del usuario:
 * En Firestore, la instrucción `updateDoc` busca el documento exacto por su ID
 * (como encontrar la misma fila en una hoja de cálculo) y SOBRESCRIBE únicamente
 * los campos enviados (por ejemplo, cambiar estado de 'Pendiente' a 'Activo'),
 * manteniendo intactos todos los demás datos existentes.
 */
export async function sobrescribirEstadoSolicitud(
  solicitudId: string,
  nuevoEstado: 'Pendiente' | 'Activo' | 'En proceso' | 'Completado' | 'Cancelado',
  datosAdicionales?: Partial<SolicitudData>
): Promise<void> {
  const docRef = doc(db, 'solicitudes', solicitudId);
  const dataUpdate: Record<string, any> = {
    estado: nuevoEstado,
    Estado: nuevoEstado,
    updatedAt: new Date().toISOString(),
    ...datosAdicionales,
  };
  await updateDoc(docRef, dataUpdate);
}

/**
 * Asigna un emprendedor a una solicitud y actualiza el estado a 'Activo'
 * sobrescribiendo la misma fila/documento en Firestore.
 */
export async function asignarEmprendedorASolicitud(
  solicitudId: string,
  idEmprendedor: string,
  nombreEmprendedor: string
): Promise<void> {
  const docRef = doc(db, 'solicitudes', solicitudId);
  await updateDoc(docRef, {
    ID_emprendedor_asignado: idEmprendedor,
    emprendedor_asignado: nombreEmprendedor,
    estado: 'Activo',
    Estado: 'Activo',
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Consulta solicitudes activas de un cliente desde Firestore
 */
export async function consultarSolicitudesCliente(
  idCliente?: string,
  clienteCorreo?: string
): Promise<SolicitudData[]> {
  try {
    const colRef = collection(db, 'solicitudes');
    const list: SolicitudData[] = [];

    if (idCliente) {
      const q = query(
        colRef,
        where('ID_cliente', '==', idCliente),
        limit(30)
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        list.push(d.data() as SolicitudData);
      });
    }

    if (list.length === 0 && clienteCorreo) {
      const qMail = query(
        colRef,
        where('cliente_correo', '==', clienteCorreo.trim()),
        limit(30)
      );
      const snapMail = await getDocs(qMail);
      snapMail.forEach((d) => {
        const item = d.data() as SolicitudData;
        if (!list.some((existing) => (existing.ID_solicitud || existing.ID_Solicitud) === (item.ID_solicitud || item.ID_Solicitud))) {
          list.push(item);
        }
      });
    }

    // Ordenar de más reciente a más antigua
    list.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return list;
  } catch (err) {
    console.warn('Error consultando solicitudes de cliente en Firestore:', err);
    return [];
  }
}

/**
 * Consulta trabajos asignados a un emprendedor desde Firestore
 */
export async function consultarTrabajosEmprendedor(
  idEmprendedor?: string,
  nombreEmprendedor?: string
): Promise<SolicitudData[]> {
  try {
    const colRef = collection(db, 'solicitudes');
    const list: SolicitudData[] = [];

    if (idEmprendedor) {
      const q = query(
        colRef,
        where('ID_emprendedor_asignado', '==', idEmprendedor),
        limit(30)
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        list.push(d.data() as SolicitudData);
      });
    }

    if (list.length === 0 && nombreEmprendedor) {
      const qNombre = query(
        colRef,
        where('emprendedor_asignado', '==', nombreEmprendedor.trim()),
        limit(30)
      );
      const snapNombre = await getDocs(qNombre);
      snapNombre.forEach((d) => {
        const item = d.data() as SolicitudData;
        if (!list.some((existing) => (existing.ID_solicitud || existing.ID_Solicitud) === (item.ID_solicitud || item.ID_Solicitud))) {
          list.push(item);
        }
      });
    }

    // Ordenar de más reciente a más antigua
    list.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return list;
  } catch (err) {
    console.warn('Error consultando trabajos de emprendedor en Firestore:', err);
    return [];
  }
}

/**
 * Registra o actualiza la solicitud para convertirse en Emprendedor Verificado.
 * Se guarda en la colección 'emprendedores' con el UID del usuario como identificador
 * de documento para garantizar una vinculación perfecta 1:1 con la cuenta.
 */
export async function solicitarVerificacionEmprendedor(
  datos: {
    uid: string;
    nombre: string;
    correo: string;
    telefono: string;
    foto?: string;
    categoria: string;
    servicio: string;
    ubicacion: string;
    modalidad?: string;
    rangoPrecios: string;
    documentoIdentificacion?: string;
    cv?: string;
    portafolio?: string;
    numeroColegiadoLicencia?: string;
    idCliente?: string;
  }
): Promise<EmprendedorData> {
  const docRef = doc(db, 'emprendedores', datos.uid);

  // Verificar si ya tiene un ID de emprendedor asignado previamente
  let idEmprendedorFinal = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const prevSnap = await getDoc(docRef);
    if (prevSnap.exists()) {
      const prevData = prevSnap.data() as EmprendedorData;
      if (prevData.ID_Emprendedor) {
        idEmprendedorFinal = prevData.ID_Emprendedor;
      }
    }
  } catch (e) {
    console.warn('No se pudo verificar ID previo de emprendedor:', e);
  }

  const payload: EmprendedorData = {
    ID_Emprendedor: idEmprendedorFinal,
    uid: datos.uid,
    Nombre: datos.nombre.trim(),
    Correo: datos.correo.trim(),
    Telefono: datos.telefono.trim(),
    Foto: datos.foto || '',
    Categoria: datos.categoria.trim(),
    Servicio: datos.servicio.trim(),
    Ubicacion: datos.ubicacion.trim(),
    Modalidad: (datos.modalidad || 'Presencial').trim(),
    Rango_Precios: datos.rangoPrecios.trim(),
    Documento_Identificacion: (datos.documentoIdentificacion || '').trim(),
    CV: (datos.cv || '').trim(),
    Portafolio: (datos.portafolio || '').trim(),
    Numero_Colegiado_Licencia: (datos.numeroColegiadoLicencia || '').trim(),
    Estado_Aprobacion: 'en revisión', // Automáticamente entra como en revisión
    Nivel: 'Básico',
    Fecha_PRO: '',
    fecha_pro: '',
    ID_Cliente: datos.idCliente || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
  return payload;
}

/**
 * Duración de la membresía OneDay Pro:
 * Mantiene la cuenta siendo Pro hasta el día siguiente al día 31 después
 * de haber presionado el pasarme a Pro (31 días + 1 día = 32 días en total).
 */
export const DIAS_DURACION_PRO = 31 + 1; // 32 días

/**
 * Evalúa si una cuenta de emprendedor es Pro actualmente.
 * Si no hay una fecha activa en 'fecha_pro', pues no aplica esta lógica
 * y por ende la cuenta no es Pro.
 * Si hay fecha, cuenta 31 días más uno adelante; si ya llegó ese día, expira.
 */
export function evaluarEstadoPro(
  emprendedor?: Partial<EmprendedorData> | null
): {
  esPro: boolean;
  fechaProDate: Date | null;
  fechaExpiracion: Date | null;
  diasRestantes: number;
  expirado: boolean;
} {
  if (!emprendedor) {
    return {
      esPro: false,
      fechaProDate: null,
      fechaExpiracion: null,
      diasRestantes: 0,
      expirado: false,
    };
  }

  // Leer la fecha de la columna fecha_pro (o Fecha_PRO para retrocompatibilidad)
  const fechaStr = (
    emprendedor.fecha_pro ||
    emprendedor.Fecha_PRO ||
    (emprendedor as any).fechaPro ||
    ''
  ).trim();

  // Si no hay fecha activa registrada en Firebase, la cuenta no es Pro
  if (!fechaStr) {
    return {
      esPro: false,
      fechaProDate: null,
      fechaExpiracion: null,
      diasRestantes: 0,
      expirado: false,
    };
  }

  const fechaInicio = new Date(fechaStr);
  if (isNaN(fechaInicio.getTime())) {
    return {
      esPro: false,
      fechaProDate: null,
      fechaExpiracion: null,
      diasRestantes: 0,
      expirado: false,
    };
  }

  const msDuracion = DIAS_DURACION_PRO * 24 * 60 * 60 * 1000;
  const fechaExpiracion = new Date(fechaInicio.getTime() + msDuracion);
  const ahora = new Date();

  // Si aún no ha llegado el día 31 + 1: la cuenta permanece siendo Pro
  if (ahora.getTime() < fechaExpiracion.getTime()) {
    const msRestantes = fechaExpiracion.getTime() - ahora.getTime();
    const diasRestantes = Math.max(1, Math.ceil(msRestantes / (24 * 60 * 60 * 1000)));
    return {
      esPro: true,
      fechaProDate: fechaInicio,
      fechaExpiracion,
      diasRestantes,
      expirado: false,
    };
  }

  // Cuando llega ese día, la cuenta automáticamente expira
  return {
    esPro: false,
    fechaProDate: fechaInicio,
    fechaExpiracion,
    diasRestantes: 0,
    expirado: true,
  };
}

/**
 * Revisa el estado de la cuenta en Firestore. Si ya venció el plazo de 31 días más 1 día:
 * - Regresa automáticamente la cuenta a básica
 * - Quita la condición Pro
 * - En ese mismo momento elimina la fecha del registro en Firebase
 */
export async function sincronizarEstadoPro(
  emprendedor: EmprendedorData,
  docId?: string
): Promise<{ emprendedor: EmprendedorData; esPro: boolean }> {
  const evaluacion = evaluarEstadoPro(emprendedor);

  if (evaluacion.expirado) {
    const targetId = docId || emprendedor.uid || emprendedor.ID_Emprendedor;
    if (targetId) {
      try {
        const docRef = doc(db, 'emprendedores', targetId);
        await updateDoc(docRef, {
          Nivel: 'Básico',
          fecha_pro: '',
          Fecha_PRO: '',
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Error al revertir emprendedor a Básico en Firestore:', err);
      }
    }

    const actualizado: EmprendedorData = {
      ...emprendedor,
      Nivel: 'Básico',
      fecha_pro: '',
      Fecha_PRO: '',
    };
    return { emprendedor: actualizado, esPro: false };
  }

  return { emprendedor, esPro: evaluacion.esPro };
}

/**
 * Busca el documento de emprendedor asociado a la cuenta de usuario
 * (revisando por docId UID, por campo uid o por correo electrónico).
 */
export async function buscarDocEmprendedorPorCuenta(
  uid: string,
  correo?: string
): Promise<{ docId: string; data: EmprendedorData } | null> {
  try {
    // 1. Probar directamente por docId igual al UID
    const docRef = doc(db, 'emprendedores', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { docId: uid, data: snap.data() as EmprendedorData };
    }

    // 2. Probar por consulta where('uid', '==', uid)
    const colRef = collection(db, 'emprendedores');
    const qUid = query(colRef, where('uid', '==', uid), limit(1));
    const snapUid = await getDocs(qUid);
    if (!snapUid.empty) {
      return {
        docId: snapUid.docs[0].id,
        data: snapUid.docs[0].data() as EmprendedorData,
      };
    }

    // 3. Probar por correo si está disponible
    if (correo && correo.trim()) {
      const qMail = query(colRef, where('Correo', '==', correo.trim()), limit(1));
      const snapMail = await getDocs(qMail);
      if (!snapMail.empty) {
        return {
          docId: snapMail.docs[0].id,
          data: snapMail.docs[0].data() as EmprendedorData,
        };
      }
    }

    return null;
  } catch (err) {
    console.warn('Error buscando documento de emprendedor por cuenta:', err);
    return null;
  }
}

/**
 * Al presionar "Pasarme a OneDay Pro":
 * - Identifica cuál es el ID del emprendedor basado en su cuenta.
 * - Valida que sea emprendedor (un cliente no puede pasarse directo a Pro sin ser emprendedor).
 * - En esa misma fila/documento edita el documento de Firebase dejando TODO igual,
 *   pero incluye en la columna 'fecha_pro' la fecha en la que se presionó el botón.
 */
export async function activarOneDayPro(
  uid: string,
  correo?: string
): Promise<{
  docId: string;
  idEmprendedor: string;
  fechaPro: string;
  emprendedorActualizado: EmprendedorData;
}> {
  const encontrado = await buscarDocEmprendedorPorCuenta(uid, correo);
  if (!encontrado) {
    throw new Error(
      'No se encontró un registro de emprendedor para tu cuenta. Si eres cliente, primero debes solicitar y verificar tu registro como emprendedor.'
    );
  }

  const { docId, data } = encontrado;
  const fechaPresionado = new Date().toISOString();

  const docRef = doc(db, 'emprendedores', docId);
  const dataActualizada: EmprendedorData = {
    ...data,
    Nivel: 'PRO',
    fecha_pro: fechaPresionado,
    Fecha_PRO: fechaPresionado,
    membresia_pro: 'sí',
    Membresia_Pro: 'sí',
    'membresía pro': 'sí',
    'Membresía Pro': 'sí',
    updatedAt: fechaPresionado,
  };

  await setDoc(docRef, dataActualizada, { merge: true });

  return {
    docId,
    idEmprendedor: data.ID_Emprendedor,
    fechaPro: fechaPresionado,
    emprendedorActualizado: dataActualizada,
  };
}

/**
 * Obtiene el perfil de emprendedor asociado al UID de un usuario en Firebase Firestore.
 * Sincroniza automáticamente el vencimiento de OneDay Pro si ya pasaron 31 días + 1 día.
 */
export async function obtenerEmprendedorPorUid(
  uid: string,
  correo?: string
): Promise<EmprendedorData | null> {
  try {
    const encontrado = await buscarDocEmprendedorPorCuenta(uid, correo);
    if (encontrado) {
      const sinc = await sincronizarEstadoPro(encontrado.data, encontrado.docId);
      return sinc.emprendedor;
    }
    return null;
  } catch (err) {
    console.warn('Error obteniendo emprendedor por UID:', err);
    return null;
  }
}

/**
 * Obtiene los datos públicos de un emprendedor por su ID_Emprendedor (ej. EMP-1001)
 * para visualización desde enlace público en el navegador.
 * Sincroniza el estado Pro si ya expiró su vigencia.
 */
export async function obtenerEmprendedorPorId(
  idEmprendedor: string
): Promise<EmprendedorData | null> {
  try {
    const colRef = collection(db, 'emprendedores');
    const q = query(
      colRef,
      where('ID_Emprendedor', '==', idEmprendedor),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data() as EmprendedorData;
      const sinc = await sincronizarEstadoPro(data, snap.docs[0].id);
      return sinc.emprendedor;
    }
    return null;
  } catch (err) {
    console.warn('Error obteniendo emprendedor por ID público:', err);
    return null;
  }
}

/**
 * Guarda una nueva reseña en la colección 'resenas' en Firebase Firestore.
 * Puede ser escrita por cualquier visitante desde el enlace público del perfil.
 */
export async function guardarResenaEnFirestore(
  idEmprendedor: string,
  nombreCliente: string,
  estrellas: number,
  comentario: string
): Promise<ResenaData> {
  const idResena = `REV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const docRef = doc(db, 'resenas', idResena);

  const fechaLegible = new Date().toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const payload: ResenaData = {
    ID_reseña: idResena,
    ID_Emprendedor: idEmprendedor,
    nombre_cliente: nombreCliente.trim() || 'Cliente verificado',
    estrellas: Math.min(5, Math.max(1, Math.round(estrellas))),
    comentario: comentario.trim(),
    fecha: fechaLegible,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload);
  return payload;
}

/**
 * Obtiene todas las reseñas asociadas a un ID_Emprendedor desde Firestore.
 */
export async function obtenerResenasEmprendedor(
  idEmprendedor: string
): Promise<ResenaData[]> {
  try {
    const colRef = collection(db, 'resenas');
    const q = query(
      colRef,
      where('ID_Emprendedor', '==', idEmprendedor),
      limit(50)
    );
    const snap = await getDocs(q);
    const lista: ResenaData[] = [];
    snap.forEach((d) => {
      lista.push(d.data() as ResenaData);
    });

    // Ordenar de más reciente a más antigua
    lista.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return lista;
  } catch (err) {
    console.warn('Error consultando reseñas en Firestore:', err);
    return [];
  }
}

/**
 * Calcula el promedio de estrellas y total de reseñas reales en Firestore
 */
export function calcularPuntuacionResenas(resenas: ResenaData[]): {
  promedio: number;
  promedioTexto: string;
  total: number;
} {
  if (!resenas || resenas.length === 0) {
    return { promedio: 0, promedioTexto: '0.0', total: 0 };
  }
  const suma = resenas.reduce((acc, r) => acc + (r.estrellas || 0), 0);
  const prom = suma / resenas.length;
  return {
    promedio: Math.round(prom * 10) / 10,
    promedioTexto: (Math.round(prom * 10) / 10).toFixed(1),
    total: resenas.length,
  };
}

/**
 * Guarda o sobrescribe la biografía del emprendedor en la categoría/colección 'biografias'
 * de Firestore con el ID del emprendedor como identificador del documento.
 */
export async function guardarBiografiaEnFirestore(
  idEmprendedor: string,
  texto: string
): Promise<void> {
  if (!idEmprendedor) return;
  const docRef = doc(db, 'biografias', idEmprendedor);
  await setDoc(
    docRef,
    {
      idEmprendedor,
      ID_Emprendedor: idEmprendedor,
      texto: texto.trim(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Obtiene la biografía de un emprendedor desde la colección 'biografias' de Firestore.
 */
export async function obtenerBiografiaDeFirestore(
  idEmprendedor: string
): Promise<string> {
  if (!idEmprendedor) return '';
  try {
    const docRef = doc(db, 'biografias', idEmprendedor);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.texto || data.biografia || '').trim();
    }
    return '';
  } catch (err) {
    console.warn('Error al leer biografía de Firestore:', err);
    return '';
  }
}

/**
 * Sobrescribe los datos editables del perfil del emprendedor en Firebase:
 * - Biografía: en la categoría 'biografias' con su ID de emprendedor
 * - Ubicación (lugar de cobertura): en la categoría 'emprendedores' con su ID
 * - Modalidad (Presencial / Remoto / Híbrido): en la categoría 'emprendedores'
 * - Foto: en 'emprendedores' y 'clientes'
 * El Servicio y Nombre se mantienen bloqueados y no se pueden cambiar.
 */
export async function sobrescribirPerfilEmprendedor(
  docId: string,
  idEmprendedor: string,
  cambios: {
    biografia?: string;
    ubicacion?: string;
    modalidad?: string;
    foto?: string;
  }
): Promise<void> {
  const updatesEmprendedor: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  // 1. Sobrescribir biografía en la colección 'biografias' con su ID
  if (cambios.biografia !== undefined && idEmprendedor) {
    await guardarBiografiaEnFirestore(idEmprendedor, cambios.biografia);
    updatesEmprendedor.Biografia = cambios.biografia.trim();
    updatesEmprendedor.biografia = cambios.biografia.trim();
  }

  // 2. Sobrescribir lugar de cobertura si fue modificado
  if (cambios.ubicacion !== undefined) {
    updatesEmprendedor.Ubicacion = cambios.ubicacion.trim();
  }

  // 3. Sobrescribir modalidad si fue modificada
  if (cambios.modalidad !== undefined) {
    updatesEmprendedor.Modalidad = cambios.modalidad.trim();
  }

  // 4. Sobrescribir foto si fue modificada
  if (cambios.foto) {
    updatesEmprendedor.Foto = cambios.foto;
    try {
      await setDoc(
        doc(db, 'clientes', docId),
        { Foto: cambios.foto, foto: cambios.foto, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (e) {
      console.warn('Error al sincronizar foto en clientes:', e);
    }
  }

  // Sobrescribir en Firestore en la categoría emprendedores
  const empDocRef = doc(db, 'emprendedores', docId);
  await setDoc(empDocRef, updatesEmprendedor, { merge: true });
}

export interface CatalogoItemData {
  idItem?: string;
  idEmprendedor?: string;
  ID_Emprendedor?: string;
  nombre: string;
  precio: string;
  descripcion?: string;
  foto?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

/**
 * Límites de ítems de catálogo según categoría del emprendedor:
 * Profesionales o Creativos: hasta máximo 3 ítems.
 * Espacios o Marcas: hasta máximo 5 ítems.
 */
export function obtenerMaxItemsCatalogo(categoria?: string): number {
  const cat = (categoria || '').toLowerCase().trim();
  if (cat.includes('espacio') || cat.includes('marca')) {
    return 5;
  }
  return 3;
}

/**
 * Obtiene el catálogo de un emprendedor 100% basado en Firestore.
 * No inventa información. Si no tiene productos, devuelve array vacío.
 */
export async function obtenerCatalogoEmprendedor(
  idEmprendedor: string
): Promise<CatalogoItemData[]> {
  if (!idEmprendedor) return [];
  try {
    const colRef = collection(db, 'catalogos');
    const q = query(
      colRef,
      where('idEmprendedor', '==', idEmprendedor),
      limit(20)
    );
    const snap = await getDocs(q);
    const lista: CatalogoItemData[] = [];
    snap.forEach((d) => {
      const data = d.data() as CatalogoItemData;
      lista.push({
        ...data,
        id: data.idItem || d.id,
      });
    });

    if (lista.length === 0) {
      const qAlt = query(
        colRef,
        where('ID_Emprendedor', '==', idEmprendedor),
        limit(20)
      );
      const snapAlt = await getDocs(qAlt);
      snapAlt.forEach((d) => {
        const data = d.data() as CatalogoItemData;
        if (!lista.some((x) => x.idItem === data.idItem)) {
          lista.push({
            ...data,
            id: data.idItem || d.id,
          });
        }
      });
    }

    lista.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return lista;
  } catch (err) {
    console.warn('Error al obtener catálogo de Firestore:', err);
    return [];
  }
}

/**
 * Guarda un ítem de catálogo en Firestore en la colección 'catalogos'.
 * Se almacena con su ID de emprendedor y propio ID de ítem.
 */
export async function guardarItemCatalogoEnFirestore(
  idEmprendedor: string,
  item: {
    nombre: string;
    precio: string;
    descripcion?: string;
    foto?: string;
    idItem?: string;
  }
): Promise<CatalogoItemData> {
  const idItem = item.idItem || `ITEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const docRef = doc(db, 'catalogos', idItem);

  const payload: CatalogoItemData = {
    id: idItem,
    idItem,
    idEmprendedor,
    ID_Emprendedor: idEmprendedor,
    nombre: item.nombre.trim(),
    precio: item.precio.trim(),
    descripcion: item.descripcion?.trim() || '',
    foto: item.foto || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload);
  return payload;
}

/**
 * Elimina un ítem de catálogo de Firebase Firestore.
 */
export async function eliminarItemCatalogoDeFirestore(
  idItem: string
): Promise<void> {
  if (!idItem) return;
  try {
    const docRef = doc(db, 'catalogos', idItem);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error al eliminar ítem de catálogo en Firestore:', err);
    throw err;
  }
}

/**
 * Elimina para siempre la tarjeta de impulso del perfil en la cuenta del usuario.
 */
export async function eliminarTarjetaImpulsoDeCuenta(
  docId: string
): Promise<void> {
  if (!docId) return;
  try {
    const docRef = doc(db, 'emprendedores', docId);
    await updateDoc(docRef, {
      tarjeta_impulso_eliminada: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Error al marcar tarjeta de impulso eliminada en Firestore:', err);
  }
}

export interface FavoritoData {
  id: string;
  userId: string;
  idEmprendedor: string;
  nombre: string;
  servicio: string;
  ubicacion: string;
  modalidad?: string;
  foto?: string;
  categoria?: string;
  createdAt: string;
}

/**
 * Guarda o actualiza un emprendedor en la lista de favoritos de Firestore.
 */
export async function guardarFavoritoEnFirestore(
  userId: string,
  emp: {
    idEmprendedor: string;
    nombre: string;
    servicio: string;
    ubicacion: string;
    modalidad?: string;
    foto?: string;
    categoria?: string;
  }
): Promise<FavoritoData> {
  const docId = `${userId}_${emp.idEmprendedor}`;
  const docRef = doc(db, 'favoritos', docId);
  const data: FavoritoData = {
    id: docId,
    userId,
    idEmprendedor: emp.idEmprendedor,
    nombre: emp.nombre,
    servicio: emp.servicio,
    ubicacion: emp.ubicacion,
    modalidad: emp.modalidad || '',
    foto: emp.foto || '',
    categoria: emp.categoria || '',
    createdAt: new Date().toISOString(),
  };
  await setDoc(docRef, data, { merge: true });
  return data;
}

/**
 * Elimina un emprendedor de la colección de favoritos en Firestore.
 */
export async function eliminarFavoritoDeFirestore(
  userId: string,
  idEmprendedor: string
): Promise<void> {
  const docId = `${userId}_${idEmprendedor}`;
  const docRef = doc(db, 'favoritos', docId);
  await deleteDoc(docRef);
}

/**
 * Obtiene la lista de favoritos de un usuario desde Firestore.
 */
export async function obtenerFavoritosDeFirestore(
  userId: string
): Promise<FavoritoData[]> {
  if (!userId) return [];
  try {
    const q = query(collection(db, 'favoritos'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const favs: FavoritoData[] = [];
    snap.forEach((d) => {
      favs.push(d.data() as FavoritoData);
    });
    return favs;
  } catch (err) {
    console.warn('Error al obtener favoritos de Firestore:', err);
    return [];
  }
}



