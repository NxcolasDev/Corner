import { Volume2, RotateCw } from "lucide-react";

const StudyCard = ({ flashcard, flipped, onFlip, onSpeak }) => {
  const frontText = flashcard?.front || flashcard?.question || "Sem pergunta";
  const backText = flashcard?.back || flashcard?.answer || "Sem resposta";
  const imageUrl = flashcard?.imageUrl || flashcard?.image || "";

  return (
    <div className="w-full flex justify-center">
      <div
        onClick={onFlip}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={flipped ? "Ver pergunta" : "Ver resposta"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onFlip();
          }
        }}
        className={`relative w-full min-h-[420px] rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-2xl border flex flex-col justify-between overflow-hidden select-none focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
          flipped
            ? "bg-blue-600 border-blue-500 text-white"
            : "bg-slate-900 border-slate-800 text-white"
        }`}
      >
        {/* Imagem de Fundo (Se houver URL válida) */}
        {imageUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={imageUrl}
              alt="Card Media"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div
              className={`absolute inset-0 ${
                flipped
                  ? "bg-gradient-to-t from-blue-950 via-blue-900/80 to-transparent"
                  : "bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"
              }`}
            />
          </div>
        )}

        {/* Topo do Card */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${
              flipped
                ? "bg-white/20 text-white border-white/30"
                : "bg-blue-500/20 text-blue-300 border-blue-400/30"
            }`}
          >
            {flipped ? "Resposta" : "Pergunta"}
          </span>

          {onSpeak && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(flipped ? backText : frontText);
              }}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title="Ouvir pronúncia"
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>

        {/* Centro (Conteúdo / Texto Principal) */}
        <div className="relative z-10 my-auto py-8 text-center px-4">
          <p className="text-2xl md:text-4xl font-extrabold leading-relaxed text-balance text-white">
            {flipped ? backText : frontText}
          </p>
        </div>

        {/* Rodapé do Card */}
        <div className="relative z-10 flex items-center justify-between text-xs font-semibold pt-4 border-t border-white/10 text-slate-300">
          <span className="flex items-center gap-2">
            <RotateCw size={15} className="animate-spin-slow" />
            Clique ou pressione <code className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Espaço</code> para virar
          </span>

          {flashcard?.difficulty && (
            <span className="uppercase tracking-wider font-bold bg-white/10 px-3 py-1 rounded-lg text-white">
              {flashcard.difficulty}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyCard;