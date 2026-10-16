import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import type { ResenaData } from '../../services/firebaseDataService';

// Componente interactivo de carrusel de reseñas super sutil y minimalista
interface ResenasCarruselProps {
  resenas: ResenaData[];
  sinResenasMensaje?: string;
}

export function ResenasCarrusel({
  resenas,
  sinResenasMensaje,
}: ResenasCarruselProps) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (resenas.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % resenas.length);
    }, 4500);
    return () => clearInterval(intervalo);
  }, [resenas.length]);

  if (!resenas || resenas.length === 0) {
    return null;
  }

  const resenaActual = resenas[indice] || resenas[0];

  return (
    <div className="bg-neutral-50/90 border border-neutral-200/60 rounded-2xl p-4 text-left space-y-2.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((estrella) => (
            <Star
              key={estrella}
              size={11}
              className={
                estrella <= (resenaActual.estrellas || 5)
                  ? 'fill-neutral-900 text-neutral-900'
                  : 'text-neutral-200'
              }
            />
          ))}
        </div>

        {resenas.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            {resenas.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIndice(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  indice === idx ? 'w-3.5 bg-neutral-800' : 'w-1.5 bg-neutral-300'
                }`}
                aria-label={`Reseña ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-700 leading-relaxed italic">
        “{resenaActual.comentario}”
      </p>

      <div className="pt-1 border-t border-neutral-200/50 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-900 truncate">
          {resenaActual.nombre_cliente}
        </span>
      </div>
    </div>
  );
}
