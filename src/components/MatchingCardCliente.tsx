import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import {
  EmprendedorData,
  SolicitudData,
  obtenerEmprendedorParaMatch,
  guardarFavoritoEnFirestore,
  eliminarFavoritoDeFirestore,
} from '../services/firebaseDataService';

export interface MatchingCardClienteProps {
  solicitud: SolicitudData;
  authUid?: string;
  onChatClick?: () => void;
}

export const MatchingCardCliente: React.FC<MatchingCardClienteProps> = ({
  solicitud,
  authUid,
  onChatClick,
}) => {
  const [emprendedor, setEmprendedor] = useState<EmprendedorData | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);

  const idEmp = solicitud.ID_emprendedor_asignado || '';
  const estado = (solicitud.estado || solicitud.Estado || 'Pendiente').toLowerCase();
  const tieneAsignacion = idEmp && estado !== 'pendiente' && estado !== 'cancelado';

  useEffect(() => {
    if (idEmp && tieneAsignacion) {
      obtenerEmprendedorParaMatch(idEmp).then((emp) => {
        setEmprendedor(emp || null);
      });
    } else {
      setEmprendedor(null);
    }
  }, [idEmp, tieneAsignacion]);

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

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-2xs">
      {/* Fila superior: foto + nombre del emprendedor (o buscando) */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-neutral-200 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
          {emprendedor?.Foto ? (
            <img
              src={emprendedor.Foto}
              alt={emprendedor.Nombre}
              className="w-full h-full object-cover"
            />
          ) : emprendedor ? (
            <span className="text-sm font-bold text-neutral-700">
              {emprendedor.Nombre.charAt(0).toUpperCase()}
            </span>
          ) : (
            <div className="w-3 h-3 rounded-full bg-neutral-400 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {emprendedor ? (
            <>
              <h4 className="text-sm font-bold text-neutral-900 truncate">
                {emprendedor.Nombre}
              </h4>
              <span className="text-[11px] text-neutral-500 truncate block">
                {emprendedor.Servicio || 'Emprendedor'}
              </span>
            </>
          ) : (
            <>
              <h4 className="text-sm font-medium text-neutral-400">
                Buscando emprendedor...
              </h4>
              <span className="text-[11px] text-neutral-300">One Day</span>
            </>
          )}
        </div>

        <span className="text-[10px] font-mono font-bold text-neutral-300 shrink-0">
          #{solicitud.ID_solicitud || solicitud.ID_Solicitud}
        </span>
      </div>

      {/* Servicio solicitado */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-neutral-800">
          {solicitud.servicio_buscado || solicitud.Servicio_Buscado || 'Servicio'}
        </span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-500">
          {solicitud.presupuesto || solicitud.Presupuesto || ''}
        </span>
      </div>

      {/* Botones circulares: solo cuando hay emprendedor asignado */}
      {emprendedor && (
        <div className="flex items-center gap-3 pt-1 border-t border-neutral-200/60">
          <button
            type="button"
            onClick={onChatClick}
            className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-white transition cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Chat con emprendedor"
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="button"
            onClick={handleFavorito}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs ${
              esFavorito
                ? 'bg-neutral-900 border-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
            }`}
            aria-label="Agregar a favoritos"
          >
            <Heart
              size={18}
              className={esFavorito ? 'fill-white text-white' : 'text-neutral-700'}
            />
          </button>

          <span className="ml-auto text-[11px] text-neutral-400">
            {estado === 'activo' ? 'Asignado' : estado}
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchingCardCliente;
