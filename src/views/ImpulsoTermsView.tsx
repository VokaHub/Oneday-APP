import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ImpulsoTermsViewProps {
  onBack: () => void;
  onAccept: () => void;
  isSaving: boolean;
}

export default function ImpulsoTermsView({
  onBack,
  onAccept,
  isSaving,
}: ImpulsoTermsViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between py-4 animate-in fade-in duration-150 bg-white min-h-[520px]">
      <div>
        <header className="flex items-center gap-3 pt-1 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition cursor-pointer"
            title="Volver"
          >
            <ArrowLeft size={18} />
          </button>
        </header>

        <div className="pt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Términos y condiciones
          </h1>
        </div>
      </div>

      <div className="pt-12 pb-4">
        <button
          type="button"
          onClick={onAccept}
          disabled={isSaving}
          className="w-full py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <RefreshCw size={14} className="animate-spin text-white" />
          ) : (
            <span>Aceptar</span>
          )}
        </button>
      </div>
    </div>
  );
}
