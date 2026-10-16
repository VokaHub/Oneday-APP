import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Heart, ChevronDown } from 'lucide-react';
import {
  SolicitudData,
  EmprendedorData,
  suscribirSolicitudEnTiempoReal,
  obtenerEmprendedorParaMatch,
  guardarFavoritoEnFirestore,
  eliminarFavoritoDeFirestore,
} from '../services/firebaseDataService';

export interface BlindMatchingSlideUpProps {
  solicitudId: string;
  authUid?: string;
  onClose: () => void;
  onIrAActividad: () => void;
}

export const BlindMatchingSlideUp: React.FC<BlindMatchingSlideUpProps> = ({
  solicitudId,
  authUid,
  onClose,
  onIrAActividad,
}) => {
  const [solicitud, setSolicitud] = useState<SolicitudData | null>(null);
  const [emprendedor, setEmprendedor] = useState<EmprendedorData | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);

  // Suscripción en tiempo real a la solicitud en Firestore
  useEffect(() => {
    if (!solicitudId) return;
    const unsub = suscribirSolicitudEnTiempoReal(solicitudId, (sol) => {
      setSolicitud(sol);
    });
    return () => unsub();
  }, [solicitudId]);

  // Cargar datos del emprendedor cuando se asigna
  useEffect(() => {
    const idEmp = solicitud?.ID_emprendedor_asignado || '';
    const estado = (solicitud?.estado || solicitud?.Estado || '').toLowerCase();
    if (idEmp && estado !== 'pendiente' && estado !== 'cancelado') {
      obtenerEmprendedorParaMatch(idEmp).then((emp) => {
        setEmprendedor(emp || null);
      });
    } else {
      setEmprendedor(null);
    }
  }, [solicitud?.ID_emprendedor_asignado, solicitud?.estado]);

  const handleFavorito = async () => {
    if (!emprendedor) return;
    const userId = authUid || 'guest';
    if (esFavorito) {
      setEsFavorito(false);
      try {
        await eliminarFavoritoDeFirestore(userId, emprendedor.ID_Emprendedor);
      } catch (e) {
        console.warn('Error al quitar favorito:', e);
      }
    } else {
      setEsFavorito(true);
      try {
        await guardarFavoritoEnFirestore(userId, {
          idEmprendedor: emprendedor.ID_Emprendedor,
          nombre: emprendedor.Nombre,
          servicio: emprendedor.Servicio || '',
          ubicacion: emprendedor.Ubicacion || '',
          modalidad: emprendedor.Modalidad || '',
          foto: emprendedor.Foto || '',
          categoria: emprendedor.Categoria || '',
        });
      } catch (e) {
        console.warn('Error al guardar favorito:', e);
      }
    }
  };

  const serv = solicitud?.servicio_buscado || solicitud?.Servicio_Buscado || 'Servicio';
  const pres = solicitud?.presupuesto || solicitud?.Presupuesto || '';

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-200 rounded-t-3xl shadow-2xl z-40 animate-in slide-in-from-bottom duration-300"
      style={{ maxHeight: '40vh' }}
    >
      {/* Barra de arrastre */}
      <div className="flex items-center justify-between pt-2 pb-1 px-4">
        <div className="w-10 h-1 rounded-full bg-neutral-200 mx-auto" />
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition cursor-pointer absolute right-3 top-2"
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-4 pb-5 pt-1 space-y-3">
        {/* Estado: Buscando o Asignado */}
        {emprendedor ? (
          <>
            {/* Emprendedor asignado */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
                {emprendedor.Foto ? (
                  <img
                    src={emprendedor.Foto}
                    alt={emprendedor.Nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-neutral-700">
                    {emprendedor.Nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-900 truncate">
                  {emprendedor.Nombre}
                </h4>
                <span className="text-[11px] text-neutral-500 truncate block">
                  {emprendedor.Servicio || 'Emprendedor'}
                </span>
              </div>
            </div>

            {/* Servicio + presupuesto */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-neutral-800">{serv}</span>
              {pres && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{pres}</span>
                </>
              )}
            </div>

            {/* Botones circulares neutros */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => console.log('Chat placeholder')}
                className="w-11 h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-white transition cursor-pointer active:scale-95 shadow-2xs"
                aria-label="Chat con emprendedor"
              >
                <MessageCircle size={20} />
              </button>

              <button
                type="button"
                onClick={handleFavorito}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs ${
                  esFavorito
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                }`}
                aria-label="Agregar a favoritos"
              >
                <Heart
                  size={20}
                  className={esFavorito ? 'fill-white text-white' : 'text-neutral-700'}
                />
              </button>

              <button
                type="button"
                onClick={onIrAActividad}
                className="ml-auto text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
              >
                Ver en actividad
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Buscando emprendedor */}
            <div className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-neutral-400">
                  Buscando emprendedor...
                </h4>
                <span className="text-[11px] text-neutral-300">One Day</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-neutral-700">{serv}</span>
              {pres && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{pres}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onIrAActividad}
              className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronDown size={14} />
              <span>Cerrar y ver en Actividad</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BlindMatchingSlideUp;
