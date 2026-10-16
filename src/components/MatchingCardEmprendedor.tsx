import React, { useState } from 'react';
import {
  MessageCircle,
  FileText,
  Check,
  X,
  MapPin,
} from 'lucide-react';
import {
  SolicitudData,
  aceptarSolicitudEmprendedor,
  rechazarSolicitudEmprendedor,
} from '../services/firebaseDataService';

export interface MatchingCardEmprendedorProps {
  solicitud: SolicitudData;
  miIdEmprendedor: string;
  miNombre: string;
  onChatClick?: () => void;
  onEstadoCambio?: (idSolicitud: string, nuevoEstado: string) => void;
}

export const MatchingCardEmprendedor: React.FC<MatchingCardEmprendedorProps> = ({
  solicitud,
  miIdEmprendedor,
  miNombre,
  onChatClick,
  onEstadoCambio,
}) => {
  const [cargando, setCargando] = useState(false);
  const [aceptada, setAceptada] = useState(
    (solicitud.estado || solicitud.Estado || '').toLowerCase() === 'activo' &&
      (solicitud.ID_emprendedor_asignado || '') === miIdEmprendedor
  );

  const idSol = solicitud.ID_solicitud || solicitud.ID_Solicitud || '';
  const cliente = solicitud.cliente_nombre || 'Cliente';
  const serv = solicitud.servicio_buscado || solicitud.Servicio_Buscado || 'Servicio';
  const pres = solicitud.presupuesto || solicitud.Presupuesto || '';
  const ubi = solicitud.ubicacion_servicios || solicitud.Ubicacion_Servicio || '';
  const detalles = solicitud.detalles_necesidad || solicitud.Detalles_Necesidad || '';
  const fecha = solicitud.fecha_estimado || solicitud.Fecha_Estimada || '';

  const handleAceptar = async () => {
    setCargando(true);
    try {
      await aceptarSolicitudEmprendedor(idSol, miIdEmprendedor, miNombre);
      setAceptada(true);
      onEstadoCambio?.(idSol, 'Activo');
    } catch (err) {
      console.error('Error al aceptar solicitud:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleRechazar = async () => {
    setCargando(true);
    try {
      await rechazarSolicitudEmprendedor(idSol, miIdEmprendedor);
      onEstadoCambio?.(idSol, 'Rechazado');
    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-2xs">
      {/* Fila superior: foto del cliente + nombre */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-neutral-200 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-neutral-700">
            {cliente.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-neutral-900 truncate">
            {cliente}
          </h4>
          <span className="text-[11px] text-neutral-500 truncate block">
            {serv}
          </span>
        </div>

        <span className="text-[10px] font-mono font-bold text-neutral-300 shrink-0">
          #{idSol}
        </span>
      </div>

      {/* Detalles del trabajo */}
      {detalles && (
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {detalles}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500">
        {pres && (
          <span>
            Presupuesto: <strong className="text-neutral-800">{pres}</strong>
          </span>
        )}
        {ubi && (
          <span className="flex items-center gap-0.5">
            <MapPin size={10} className="text-neutral-400" />
            {ubi}
          </span>
        )}
        {fecha && <span>• {fecha}</span>}
      </div>

      {/* Botones según estado */}
      {!aceptada ? (
        <div className="flex items-center gap-3 pt-1 border-t border-neutral-200/60">
          <button
            type="button"
            onClick={handleAceptar}
            disabled={cargando}
            className="flex-1 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-semibold transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Check size={15} />
            <span>{cargando ? 'Procesando...' : 'Aceptar'}</span>
          </button>
          <button
            type="button"
            onClick={handleRechazar}
            disabled={cargando}
            className="flex-1 h-10 rounded-full border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-neutral-700 text-xs font-semibold transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
          >
            <X size={15} />
            <span>Rechazar</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 pt-1 border-t border-neutral-200/60">
          <button
            type="button"
            onClick={onChatClick}
            className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-white transition cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Chat con cliente"
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              // Placeholder: enviar cotización
              console.log('Enviar cotización - placeholder');
            }}
            className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-700 transition cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Enviar cotización"
          >
            <FileText size={18} />
          </button>

          <span className="ml-auto text-[11px] font-semibold text-neutral-700">
            Activo
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchingCardEmprendedor;
