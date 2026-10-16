import React from 'react';
import { MessageCircle, Headset, FileText, Mail } from 'lucide-react';

export interface FooterProps {
  onOpenTerminos?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminos }) => {
  return (
    <footer className="w-full mt-10 mb-20 pt-8 pb-6 border-t border-neutral-200/80 text-center text-neutral-500">
      <div className="flex flex-col items-center justify-center space-y-4 px-4 max-w-md mx-auto">
        {/* Canales de contacto directo */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href="https://wa.me/50236723524"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <MessageCircle size={14} className="text-emerald-600" />
            <span>WhatsApp (+502)</span>
          </a>

          <a
            href="https://wa.me/50236723524?text=Hola%20One%20Day,%20necesito%20asistencia%20con%20la%20plataforma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <Headset size={14} className="text-neutral-800" />
            <span>Soporte al cliente</span>
          </a>

          {onOpenTerminos && (
            <button
              type="button"
              onClick={onOpenTerminos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <FileText size={14} className="text-neutral-500" />
              <span>Términos y condiciones</span>
            </button>
          )}
        </div>

        {/* Sección de pie de página institucional */}
        <div className="space-y-1 pt-1 text-center">
          <p className="text-xs font-semibold text-neutral-700">
            One Day Guatemala
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Conectando personas y emprendedores en todo el país.
          </p>
          <p className="text-[10px] text-neutral-400 pt-1">
            &copy; {new Date().getFullYear()} One Day. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
